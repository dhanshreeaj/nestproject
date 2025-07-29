/*
  Warnings:

  - Added the required column `razorpayId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "razorpayId" TEXT NOT NULL,
ADD COLUMN     "shiprocketOrderId" TEXT;
