-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "RestaurantTransaction" (
    "id" SERIAL NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantTransaction_restaurantId_idx" ON "RestaurantTransaction"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantTransaction_orderId_idx" ON "RestaurantTransaction"("orderId");

-- CreateIndex
CREATE INDEX "RestaurantTransaction_createdAt_idx" ON "RestaurantTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "RestaurantTransaction" ADD CONSTRAINT "RestaurantTransaction_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
