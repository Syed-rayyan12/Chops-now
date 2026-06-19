-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
