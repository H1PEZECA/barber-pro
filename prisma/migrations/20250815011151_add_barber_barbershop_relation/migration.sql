/*
  Warnings:

  - You are about to drop the column `barberId` on the `Barbershop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barbershopId]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barbershopId` to the `Barber` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Barbershop" DROP CONSTRAINT "Barbershop_barberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BarbershopService" DROP CONSTRAINT "BarbershopService_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_barbershopId_fkey";

-- DropIndex
DROP INDEX "public"."Barbershop_barberId_key";

-- DropIndex
DROP INDEX "public"."User_password_key";

-- AlterTable
ALTER TABLE "public"."Barber" ADD COLUMN     "barbershopId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Barbershop" DROP COLUMN "barberId";

-- CreateIndex
CREATE UNIQUE INDEX "Barber_barbershopId_key" ON "public"."Barber"("barbershopId");

-- AddForeignKey
ALTER TABLE "public"."Barber" ADD CONSTRAINT "Barber_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "public"."Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "public"."Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarbershopService" ADD CONSTRAINT "BarbershopService_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "public"."Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."BarbershopService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "public"."Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
