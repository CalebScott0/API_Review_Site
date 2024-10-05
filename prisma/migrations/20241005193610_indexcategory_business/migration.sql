/*
  Warnings:

  - The primary key for the `category_business` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category_business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_pkey",
DROP COLUMN "id";
