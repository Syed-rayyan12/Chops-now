-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Restaurant_deletedAt_idx" ON "Restaurant"("deletedAt");
