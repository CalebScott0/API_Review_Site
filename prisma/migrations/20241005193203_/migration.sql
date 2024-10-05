/*
  Warnings:

  - You are about to drop the column `category_name` on the `category_business` table. All the data in the column will be lost.
  - The required column `id` was added to the `category_business` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "category_business" DROP COLUMN "category_name",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "category_business_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "category_business_category_id_idx" ON "category_business"("category_id");
