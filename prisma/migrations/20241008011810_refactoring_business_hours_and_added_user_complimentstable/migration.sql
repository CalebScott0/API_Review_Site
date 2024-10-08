/*
  Warnings:

  - The primary key for the `business_hours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `friday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `monday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `saturday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `sunday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `business_hours` table. All the data in the column will be lost.
  - Added the required column `close_time` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `business_hours` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `open_time` to the `business_hours` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "compliment_type" AS ENUM ('HOT', 'MORE', 'PROFILE', 'CUTE', 'LIST', 'NOTE', 'PLAIN', 'COOL', 'FUNNY', 'WRITER', 'PHOTOS');

-- AlterTable
ALTER TABLE "business_hours" DROP CONSTRAINT "business_hours_pkey",
DROP COLUMN "friday",
DROP COLUMN "monday",
DROP COLUMN "saturday",
DROP COLUMN "sunday",
DROP COLUMN "thursday",
DROP COLUMN "tuesday",
DROP COLUMN "wednesday",
ADD COLUMN     "close_time" TEXT NOT NULL,
ADD COLUMN     "day_of_week" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "open_time" TEXT NOT NULL,
ADD CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_friend" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "user_compliment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "compliment_type" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_compliment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_hours_business_id_idx" ON "business_hours"("business_id");

-- AddForeignKey
ALTER TABLE "user_compliment" ADD CONSTRAINT "user_compliment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
