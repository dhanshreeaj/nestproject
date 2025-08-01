/*
  Warnings:

  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `email` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayOrderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayPaymentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpaySignature` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "razorpayOrderId" TEXT NOT NULL,
ADD COLUMN     "razorpayPaymentId" TEXT NOT NULL,
ADD COLUMN     "razorpaySignature" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;
