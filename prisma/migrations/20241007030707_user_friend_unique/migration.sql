/*
  Warnings:

  - The primary key for the `user_friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,friend_id]` on the table `user_friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_friend" DROP CONSTRAINT "user_friend_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "user_friend_user_id_friend_id_key" ON "user_friend"("user_id", "friend_id");
