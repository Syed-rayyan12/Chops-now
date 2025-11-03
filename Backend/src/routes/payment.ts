import { Router, Request, Response } from 'express';
import stripe from '../config/stripe';
import { authenticate, AuthRequest } from '../middlewares/auth';
import prisma from '../config/db';

const router = Router();

// Create payment intent for order
router.post('/create-payment-intent', authenticate(['USER']), async (req: AuthRequest, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId?.toString() || '',
        userId: req.user?.id?.toString() || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Payment succeeded:', paymentIntent.id);
      
      // Update order status in database
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { 
              status: 'PENDING',
            },
          });
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
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
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
    });
  } catch (error: any) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
