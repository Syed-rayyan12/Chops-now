-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerLatitude" DOUBLE PRECISION,
ADD COLUMN     "customerLongitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "lastLocationUpdate" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
