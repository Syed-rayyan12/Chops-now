import { Router } from "express";
import prisma from "../config/db";
import { authenticate, AuthRequest } from "../middlewares/auth";

const router = Router();

// ✅ GET /api/notification - Get notifications for logged-in user
router.get("/", authenticate(), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get notifications based on role and user ID
    const notifications = await (prisma as any).notification.findMany({
      where: {
        recipientRole: user.role,
        OR: [
          { recipientId: user.id },
          { recipientId: null }, // Broadcast notifications
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 notifications
    });

    // Count unread notifications
    const unreadCount = await (prisma as any).notification.count({
      where: {
        recipientRole: user.role,
        OR: [
          { recipientId: user.id },
          { recipientId: null },
        ],
        isRead: false,
      },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// ✅ POST /api/notification - Create a new notification (admin or system use)
router.post("/", authenticate(["ADMIN"]), async (req: AuthRequest, res) => {
  try {
    const { type, title, message, recipientRole, recipientId, metadata } = req.body;

    if (!type || !title || !message || !recipientRole) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const notification = await (prisma as any).notification.create({
      data: {
        type,
        title,
        message,
        recipientRole,
        recipientId: recipientId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
});

// ✅ PUT /api/notification/:id/read - Mark notification as read
router.put("/:id/read", authenticate(), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const notificationId = parseInt(id);

    // Verify notification belongs to user
    const notification = await (prisma as any).notification.findFirst({
      where: {
        id: notificationId,
        recipientRole: user.role,
        OR: [
          { recipientId: user.id },
          { recipientId: null },
        ],
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updated = await (prisma as any).notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// ✅ PUT /api/notification/read-all - Mark all notifications as read
router.put("/read-all", authenticate(), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await (prisma as any).notification.updateMany({
      where: {
        recipientRole: user.role,
        OR: [
          { recipientId: user.id },
          { recipientId: null },
        ],
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

// ✅ DELETE /api/notification/:id - Delete notification
router.delete("/:id", authenticate(), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const notificationId = parseInt(id);

    // Verify notification belongs to user
    const notification = await (prisma as any).notification.findFirst({
      where: {
        id: notificationId,
        recipientRole: user.role,
        OR: [
          { recipientId: user.id },
          { recipientId: null },
        ],
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await (prisma as any).notification.delete({
      where: { id: notificationId },
    });

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

export default router;
