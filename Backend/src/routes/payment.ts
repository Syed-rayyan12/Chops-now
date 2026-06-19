import { Router, Request, Response } from 'express';
import stripe from '../config/stripe';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../config/db';
import { logger } from "../utils/logger";
import { notifyOrderPlaced } from "../utils/orderNotifications";

const router = Router();

// Create payment intent for an existing order.
// The order is created (UNPAID) before this is called, so the charge amount is
// read from the persisted order — never from the client — and the order is
// confirmed paid only via the Stripe webhook.
router.post('/create-payment-intent', authenticate(['USER']), async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Verify the order exists and belongs to the requesting user, so a client
    // can neither pay for another user's order nor influence the amount.
    const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });

    if (!order || order.customerId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    const amount = Number(order.amount);

    // Create payment intent against the order's server-computed amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency: 'gbp',
      metadata: {
        orderId: order.id.toString(),
        userId: userId?.toString() || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount, // server-authoritative total for display
    });
  } catch (error: any) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event. Payment confirmation is the webhook's responsibility:
  // marking paymentStatus=PAID here (never from the client) is what makes a card
  // order visible/actionable to restaurants and riders.
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      logger.debug('✅ Payment succeeded:', paymentIntent.id);

      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        try {
          // Idempotent: only the transition INTO paid runs the side effects, so a
          // re-delivered webhook can't notify the restaurant / email the customer
          // twice.
          const result = await prisma.order.updateMany({
            where: { id: parseInt(orderId), paymentStatus: { not: 'PAID' } },
            data: { paymentStatus: 'PAID' },
          });
          if (result.count > 0) {
            // Payment confirmed — now run the deferred "order placed" side effects.
            await notifyOrderPlaced(parseInt(orderId));
          }
        } catch (error) {
          logger.error('Error marking order paid:', error);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      logger.debug('❌ Payment failed:', failedPayment.id);

      const orderId = failedPayment.metadata?.orderId;
      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { paymentStatus: 'FAILED' },
          });
        } catch (error) {
          logger.error('Error marking order failed:', error);
        }
      }
      break;
    }

    default:
      logger.debug(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment status
router.get('/payment-status/:paymentIntentId', authenticate(['USER']), async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back to pounds
      currency: paymentIntent.currency,
    });
  } catch (error: any) {
    logger.error('Get payment status error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
