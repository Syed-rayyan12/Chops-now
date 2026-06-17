import { Router } from 'express';
import prisma from '../config/db';
import { logger } from "../utils/logger";

const router = Router();

router.get('/db-test', async (req, res) => {
  try {
    // This just fetches one user (or nothing)
    const user = await prisma.user.findFirst();
    res.json({ message: 'Database connected!', user });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Database connection failed!' });
  }
});

export default router;
