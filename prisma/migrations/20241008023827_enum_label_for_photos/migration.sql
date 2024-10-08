/*
  Warnings:

  - Added the required column `label` to the `photo_business` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "photo_label" AS ENUM ('drink', 'food', 'inside', 'menu', 'outside');

-- AlterTable
ALTER TABLE "photo_business" DROP COLUMN "label",
ADD COLUMN     "label" "photo_label" NOT NULL;

-- CreateIndex
CREATE INDEX "user_compliment_user_id_idx" ON "user_compliment"("user_id");
