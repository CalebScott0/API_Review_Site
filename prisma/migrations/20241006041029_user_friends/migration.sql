/*
  Warnings:

  - You are about to drop the `user_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_friends" DROP CONSTRAINT "user_friends_user_id_fkey";

-- DropTable
DROP TABLE "user_friends";

-- CreateTable
CREATE TABLE "user_friend" (
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_friend_user_id_key" ON "user_friend"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_friend_friend_id_key" ON "user_friend"("friend_id");

-- CreateIndex
CREATE INDEX "user_friend_user_id_idx" ON "user_friend"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_friend_user_id_friend_id_key" ON "user_friend"("user_id", "friend_id");

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
