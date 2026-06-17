import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    logger.debug('✅ Database connected successfully');
  } catch (err) {
    logger.error('❌ Database connection failed', err);
  }
}

connectDB();

export default prisma;
