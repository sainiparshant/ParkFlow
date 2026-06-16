/*
  Warnings:

  - The `imageUrl` column on the `ParkingImages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageId` column on the `ParkingImages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ParkingImages" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[],
DROP COLUMN "imageId",
ADD COLUMN     "imageId" TEXT[];
