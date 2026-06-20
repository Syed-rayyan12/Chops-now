// The dashboard stats counts must use the SAME visibility filter as the order
// lists, which hide unpaid card orders (PAID_OR_NON_CARD). Otherwise the badge
// counts include orders the restaurant can't actually see/act on.
jest.mock("../config/db", () => ({
  __esModule: true,
  default: {
    restaurant: { findFirst: jest.fn() },
    order: { count: jest.fn() },
  },
}));
jest.mock("../config/r2", () => ({
  __esModule: true,
  uploadToR2: jest.fn(),
  deleteFromR2: jest.fn(),
  r2Client: {},
}));

import express from "express";
import request from "supertest";
import prisma from "../config/db";
import restaurantRouter from "../routes/restaurant";
import { generateToken } from "../utils/jwt";
import { PAID_OR_NON_CARD } from "../utils/orderVisibility";

const mockPrisma = prisma as unknown as {
  restaurant: { findFirst: jest.Mock };
  order: { count: jest.Mock };
};

const RESTAURANT_ID = 4;
const restaurantToken = generateToken({ id: RESTAURANT_ID, role: "RESTAURANT" });

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/restaurant", restaurantRouter);
  return app;
}

describe("GET /restaurant/:slug/stats visibility filter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.restaurant.findFirst.mockResolvedValue({ id: RESTAURANT_ID });
    mockPrisma.order.count.mockResolvedValue(0);
  });

  it("applies PAID_OR_NON_CARD to every status count", async () => {
    const res = await request(makeApp())
      .get("/restaurant/my-cafe/stats")
      .set("Authorization", `Bearer ${restaurantToken}`);

    expect(res.status).toBe(200);
    expect(mockPrisma.order.count).toHaveBeenCalled();
    for (const call of mockPrisma.order.count.mock.calls) {
      expect(call[0].where).toMatchObject({
        restaurantId: RESTAURANT_ID,
        OR: PAID_OR_NON_CARD.OR,
      });
    }
  });
});
