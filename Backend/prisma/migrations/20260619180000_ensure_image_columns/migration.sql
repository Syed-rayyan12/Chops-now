-- Reconcile drift: the original `20260114000000_add_image_fields` migration was
-- recorded as applied on some environments without the columns actually being
-- created (phantom-applied), leaving production without `User.image` /
-- `Rider.image`. This idempotent migration guarantees both columns exist; it is
-- a no-op where they already do.

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN IF NOT EXISTS "image" TEXT;
