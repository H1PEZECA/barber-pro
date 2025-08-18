/*
  Warnings:

  - You are about to drop the column `date` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `scheduledAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "date",
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL;
