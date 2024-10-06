/*
  Warnings:

  - The primary key for the `category_business` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category_business` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "category_business_business_id_category_id_key";

-- DropIndex
DROP INDEX "category_business_category_id_idx";

-- DropIndex
DROP INDEX "user_friend_user_id_friend_id_key";

-- AlterTable
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "category_business_pkey" PRIMARY KEY ("business_id", "category_id");

-- AlterTable
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_pkey" PRIMARY KEY ("user_id", "friend_id");

-- CreateIndex
CREATE INDEX "category_business_business_id_idx" ON "category_business"("business_id");

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
