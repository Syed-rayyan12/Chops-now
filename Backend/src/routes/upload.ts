import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadToR2 } from "../config/r2";
import { logger } from "../utils/logger";
import { rateLimit, clientIp } from "../utils/rateLimiter";

const router = Router();

// This endpoint stays public because it backs the careers application flow,
// where applicants upload a CV before they have any account. Being public and
// unauthenticated, it's an abuse vector (storage exhaustion / R2 cost), so it's
// throttled per IP. Applicants only ever submit one or two files.
const resumeUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => `resume-upload:ip:${clientIp(req)}`,
  message: "Too many upload attempts. Please try again later.",
});

// File filter - only allow PDF, DOC, DOCX
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."),
      false
    );
  }
};

// Configure upload with memory storage for R2
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// POST upload resume file
router.post("/resume-upload", resumeUploadLimiter, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload to R2
    const url = await uploadToR2(req.file.buffer, req.file.originalname, "resumes");
    
    return res.status(200).json({ url });
  } catch (error) {
    logger.error("Error uploading file:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});

// Error handling middleware for multer
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size exceeds 5MB limit" });
    }
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

export default router;
