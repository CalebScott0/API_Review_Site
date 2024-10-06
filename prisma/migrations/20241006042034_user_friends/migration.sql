/*
  Warnings:

  - A unique constraint covering the columns `[user_id,friend_id]` on the table `user_friend` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "user_friend" DROP CONSTRAINT "user_friend_user_id_fkey";

-- DropIndex
DROP INDEX "user_friend_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_friend_user_id_friend_id_key" ON "user_friend"("user_id", "friend_id");
