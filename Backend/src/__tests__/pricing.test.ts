// Server pricing must ignore any client-supplied price and use DB prices only.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    restaurant: { findUnique: jest.fn() },
    menuItem: { findMany: jest.fn() },
  },
}));

import prisma from "../config/db";
import { calculateOrderPricing } from "../utils/pricing";

const mockPrisma = prisma as unknown as {
  restaurant: { findUnique: jest.Mock };
  menuItem: { findMany: jest.Mock };
};

describe("calculateOrderPricing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.restaurant.findUnique.mockResolvedValue({
      name: "Test Diner",
      deliveryFee: 2.5,
      latitude: null,
      longitude: null,
    });
    mockPrisma.menuItem.findMany.mockResolvedValue([
      { id: 1, name: "Burger", price: 10, isAvailable: true },
    ]);
  });

  it("ignores the client-supplied price and uses the DB price", async () => {
    const result = await calculateOrderPricing({
      restaurantId: 1,
      // A tampered cart claims the burger costs 1p. The server must ignore it.
      items: [{ menuItemId: 1, quantity: 2, price: 0.01 } as any],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.pricing.subtotal).toBe(20); // 10 * 2, NOT 0.02
    expect(result.pricing.lineItems[0].unitPrice).toBe(10);
    // 15% service fee + £2.50 flat delivery (no GPS) => 20 + 3 + 2.5
    expect(result.pricing.amount).toBe(25.5);
  });

  it("rejects items that do not belong to the restaurant", async () => {
    mockPrisma.menuItem.findMany.mockResolvedValue([]);
    const result = await calculateOrderPricing({
      restaurantId: 1,
      items: [{ menuItemId: 999, quantity: 1 }],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.status).toBe(400);
  });

  it("rejects unavailable items", async () => {
    mockPrisma.menuItem.findMany.mockResolvedValue([
      { id: 1, name: "Burger", price: 10, isAvailable: false },
    ]);
    const result = await calculateOrderPricing({
      restaurantId: 1,
      items: [{ menuItemId: 1, quantity: 1 }],
    });
    expect(result.ok).toBe(false);
  });
});
