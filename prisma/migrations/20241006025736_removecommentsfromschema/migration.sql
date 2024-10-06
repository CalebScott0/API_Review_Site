/*
  Warnings:

  - You are about to drop the column `comment_count` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `comment_count` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "business_attributes_business_id_key";

-- DropIndex
DROP INDEX "business_hours_business_id_key";

-- AlterTable
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_pkey" PRIMARY KEY ("business_id");

-- AlterTable
ALTER TABLE "review" DROP COLUMN "comment_count";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "comment_count";
