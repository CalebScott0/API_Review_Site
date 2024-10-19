/*
  Warnings:

  - Added the required column `Longitude` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "Longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL;
