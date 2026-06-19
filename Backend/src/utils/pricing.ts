import prisma from "../config/db";
import { calculateDistance } from "./location";

export interface PricingInputItem {
  menuItemId: number;
  quantity: number;
}

export interface PricedLineItem {
  menuItemId: number;
  title: string;
  qty: number;
  unitPrice: number;
  total: number;
}

type AuthoritativeMenuItem = {
  id: number;
  name: string;
  price: unknown;
  isAvailable: boolean;
};

export interface OrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  riderPayout: number;
  restaurantPayout: number;
  platformRevenue: number;
  tip: number;
  amount: number;
  distanceKm: number | null;
  lineItems: PricedLineItem[];
  restaurantName: string;
}

export type PricingResult =
  | { ok: true; pricing: OrderPricing }
  | { ok: false; status: number; message: string };

const SERVICE_FEE_RATE = 0.15;
const DEFAULT_DELIVERY_FEE = 2.5;

/**
 * Computes order pricing authoritatively from the database. Item prices are
 * NEVER taken from the client — they are looked up from MenuItem by id. This is
 * the single source of truth shared by order creation and payment-intent
 * creation so the charged amount and the persisted order always agree.
 */
export async function calculateOrderPricing(params: {
  restaurantId: number;
  items: PricingInputItem[];
  customerLatitude?: number | null;
  customerLongitude?: number | null;
}): Promise<PricingResult> {
  const { restaurantId, items, customerLatitude, customerLongitude } = params;

  if (!restaurantId || !Array.isArray(items) || items.length === 0) {
    return { ok: false, status: 400, message: "Missing restaurant or items" };
  }

  // Normalize + validate the requested line items
  const normalized: { menuItemId: number; quantity: number }[] = [];
  for (const raw of items) {
    const menuItemId = Number(raw?.menuItemId);
    const quantity = Number(raw?.quantity);
    if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
      return { ok: false, status: 400, message: "Each item requires a valid menuItemId" };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { ok: false, status: 400, message: "Each item requires a positive integer quantity" };
    }
    normalized.push({ menuItemId, quantity });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { name: true, deliveryFee: true, latitude: true, longitude: true },
  });

  if (!restaurant) {
    return { ok: false, status: 404, message: "Restaurant not found" };
  }

  // Fetch authoritative prices for exactly the requested items, scoped to this restaurant
  const menuItemIds = [...new Set(normalized.map((i) => i.menuItemId))];
  const menuItems = (await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, restaurantId },
    select: { id: true, name: true, price: true, isAvailable: true },
  })) as AuthoritativeMenuItem[];
  const menuItemById = new Map<number, AuthoritativeMenuItem>(
    menuItems.map((m: AuthoritativeMenuItem) => [m.id, m])
  );

  let subtotal = 0;
  const lineItems: PricedLineItem[] = [];
  for (const item of normalized) {
    const menuItem = menuItemById.get(item.menuItemId);
    if (!menuItem) {
      return {
        ok: false,
        status: 400,
        message: `Menu item ${item.menuItemId} is not available at this restaurant`,
      };
    }
    if (!menuItem.isAvailable) {
      return { ok: false, status: 400, message: `"${menuItem.name}" is currently unavailable` };
    }
    const unitPrice = Number(menuItem.price);
    const total = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += total;
    lineItems.push({
      menuItemId: menuItem.id,
      title: menuItem.name,
      qty: item.quantity,
      unitPrice,
      total,
    });
  }
  subtotal = Math.round(subtotal * 100) / 100;

  // Distance drives the delivery fee so the persisted/charged total matches the
  // distance-based figure the checkout summary shows: £0.50/km, with a flat
  // £2.50 fallback when GPS is unavailable. Mirrors the frontend
  // lib/utils/distance.calculateDeliveryFee so display and charge never diverge.
  let distanceKm: number | null = null;
  if (customerLatitude && customerLongitude && restaurant.latitude && restaurant.longitude) {
    distanceKm = calculateDistance(
      customerLatitude,
      customerLongitude,
      restaurant.latitude,
      restaurant.longitude
    );
  }

  const PER_KM_RATE = 0.5;
  const deliveryFee =
    distanceKm && distanceKm > 0
      ? Math.round(distanceKm * PER_KM_RATE * 100) / 100
      : DEFAULT_DELIVERY_FEE;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  const restaurantPayout = subtotal;
  const platformRevenue = serviceFee;
  const riderPayout = deliveryFee;
  const tip = 0;
  const amount = Math.round((subtotal + serviceFee + deliveryFee) * 100) / 100;

  return {
    ok: true,
    pricing: {
      subtotal,
      serviceFee,
      deliveryFee,
      riderPayout,
      restaurantPayout,
      platformRevenue,
      tip,
      amount,
      distanceKm,
      lineItems,
      restaurantName: restaurant.name,
    },
  };
}
