/*
  Warnings:

  - Added the required column `pricePerDay` to the `ParkingType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('available', 'booked');

-- AlterTable
ALTER TABLE "ParkingType" ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ParkingSlots" (
    "id" TEXT NOT NULL,
    "slot_status" "SlotStatus" NOT NULL DEFAULT 'available',
    "parkingId" TEXT NOT NULL,
    "parkingTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingSlots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkingSlots" ADD CONSTRAINT "ParkingSlots_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingSlots" ADD CONSTRAINT "ParkingSlots_parkingTypeId_fkey" FOREIGN KEY ("parkingTypeId") REFERENCES "ParkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
