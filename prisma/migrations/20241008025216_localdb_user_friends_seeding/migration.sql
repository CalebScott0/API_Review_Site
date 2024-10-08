/*
  Warnings:

  - You are about to drop the column `friends_since` on the `user_compliment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_friend` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_compliment" DROP COLUMN "friends_since",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_friend" DROP COLUMN "created_at",
ADD COLUMN     "friends_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
