/*
  Warnings:

  - Added the required column `documentId` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "documentId" TEXT NOT NULL;
