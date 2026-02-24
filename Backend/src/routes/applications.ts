import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// GET all applications (admin only)
router.get("/applications", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// GET single application
router.get("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ error: "Failed to fetch application" });
  }
});

// POST create new application
router.post("/applications", async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      resumeUrl,
      expectedSalary,
      availableDate,
    } = req.body;

    // Validate required fields
    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "active") {
      return res
        .status(400)
        .json({ error: "This job is no longer accepting applications" });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        resumeUrl: resumeUrl || null,
        expectedSalary: expectedSalary || null,
        availableDate: availableDate || null,
      },
    });

    // Create admin notification for new application
    try {
      await (prisma as any).notification.create({
        data: {
          type: "SYSTEM_ALERT",
          title: "New Job Application",
          message: `${fullName} applied for ${job.title} (${job.department})`,
          recipientRole: "ADMIN",
          recipientId: null,
          metadata: JSON.stringify({
            applicationId: application.id,
            jobId: job.id,
            jobTitle: job.title,
            applicantName: fullName,
            applicantEmail: email,
          }),
        },
      });
    } catch (notifError) {
      console.error("Failed to create notification (non-blocking):", notifError);
    }

    return res.status(201).json({ application });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: "Failed to submit application" });
  }
});

// PATCH update application status
router.patch("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ error: "Failed to update application" });
  }
});

// DELETE application
router.delete("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.application.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
