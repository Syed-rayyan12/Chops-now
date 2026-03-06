import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = "381370613fec5e31ad4616a7fa80e07c";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "35eb90f12a06aaacb3e6465f8fd61696";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "9f133f0108bc7bf6facffa9c418c154172c4425754e9f0653a63bc753ee6427c";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "chopnow";
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`;

// Public URL base - update this after enabling Public Dev URL or custom domain
// For now using the R2 public dev URL format
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://pub-${R2_ACCOUNT_ID}.r2.dev`;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file buffer to R2
 * @param buffer - File buffer
 * @param originalName - Original filename (for extension)
 * @param folder - Folder/prefix in the bucket (e.g., "menu-items", "restaurants")
 * @returns Public URL of the uploaded file
 */
export async function uploadToR2(
  buffer: Buffer,
  originalName: string,
  folder: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  const key = `${folder}/${uniqueId}${ext}`;

  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const contentType = contentTypeMap[ext] || "application/octet-stream";

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return the public URL
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from R2 by its public URL
 */
export async function deleteFromR2(publicUrl: string): Promise<void> {
  try {
    const key = publicUrl.replace(`${R2_PUBLIC_URL}/`, "");
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error("Error deleting from R2:", error);
  }
}

console.log("✅ Cloudflare R2 configured:", {
  bucket: R2_BUCKET_NAME,
  endpoint: R2_ENDPOINT,
});
