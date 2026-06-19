-- CreateEnum
CREATE TYPE "RiderApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "approvalStatus" "RiderApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- Backfill: existing riders predate the approval gate and were already operating,
-- so grant them APPROVED to avoid locking active riders out. Only riders created
-- after this migration go through the PENDING -> admin approval flow.
UPDATE "Rider" SET "approvalStatus" = 'APPROVED';
