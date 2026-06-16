/*
  Warnings:

  - Added the required column `phoneNumber` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TWO_WHEELER', 'FOUR_WHEELER', 'HEAVY_VEHICLE');

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parkingId" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "parkingTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parking" (
    "id" TEXT NOT NULL,
    "parkingName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "parkingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingType" (
    "id" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'TWO_WHEELER',
    "pricePerHour" DOUBLE PRECISION NOT NULL,
    "totalSlots" INTEGER NOT NULL,
    "slotsAvailable" INTEGER NOT NULL,
    "parkingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_parkingId_idx" ON "Booking"("parkingId");

-- CreateIndex
CREATE INDEX "Parking_vendorId_idx" ON "Parking"("vendorId");

-- CreateIndex
CREATE INDEX "Parking_city_state_idx" ON "Parking"("city", "state");

-- CreateIndex
CREATE INDEX "ParkingType_vehicleType_idx" ON "ParkingType"("vehicleType");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parkingTypeId_fkey" FOREIGN KEY ("parkingTypeId") REFERENCES "ParkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingImages" ADD CONSTRAINT "ParkingImages_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingType" ADD CONSTRAINT "ParkingType_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
