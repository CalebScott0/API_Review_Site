/*
  Warnings:

  - You are about to drop the `user_friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "friends" TEXT[];

-- DropTable
DROP TABLE "user_friends";
