import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadToR2 } from "../config/r2";

const router = Router();

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
router.post("/resume-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Upload to R2
    const url = await uploadToR2(req.file.buffer, req.file.originalname, "resumes");
    
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
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
