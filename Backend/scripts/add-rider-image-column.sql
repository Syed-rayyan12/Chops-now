-- Add image column to Rider table if it doesn't exist
ALTER TABLE "Rider" ADD COLUMN IF NOT EXISTS "image" TEXT;
