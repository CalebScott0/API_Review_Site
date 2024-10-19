/*
  Warnings:

  - You are about to drop the column `Longitude` on the `businesses` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "Longitude",
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
