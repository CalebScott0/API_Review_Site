/*
  Warnings:

  - You are about to drop the column `friends` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "friends";

-- CreateTable
CREATE TABLE "user_friends" (
    "user_id" TEXT NOT NULL,
    "friends" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "user_friends_user_id_key" ON "user_friends"("user_id");

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
