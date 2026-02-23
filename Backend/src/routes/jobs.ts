import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// GET all active jobs (public)
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET all jobs (admin - includes inactive)
router.get("/jobs/all", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET single job by ID
router.get("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST create new job (admin only)
router.post("/jobs", async (req, res) => {
  try {
    const {
      title,
      department,
      jobType,
      location,
      salaryRange,
      description,
      requirements,
      responsibilities,
      status,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !department ||
      !jobType ||
      !location ||
      !description ||
      !requirements ||
      !responsibilities
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        department,
        jobType,
        location,
        salaryRange: salaryRange || null,
        description,
        requirements,
        responsibilities,
        status: status || "active",
      },
    });

    return res.status(201).json({ job });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ error: "Failed to create job" });
  }
});

// PATCH update job
router.patch("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: any = {};

    // Only update fields that are provided
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.department) updateData.department = req.body.department;
    if (req.body.jobType) updateData.jobType = req.body.jobType;
    if (req.body.location) updateData.location = req.body.location;
    if (req.body.salaryRange !== undefined)
      updateData.salaryRange = req.body.salaryRange;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.requirements)
      updateData.requirements = req.body.requirements;
    if (req.body.responsibilities)
      updateData.responsibilities = req.body.responsibilities;
    if (req.body.status) updateData.status = req.body.status;

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({ job });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE job
router.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ error: "Failed to delete job" });
  }
});

export default router;
