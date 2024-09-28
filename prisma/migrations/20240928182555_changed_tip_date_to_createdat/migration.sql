/*
  Warnings:

  - You are about to drop the column `text` on the `tip` table. All the data in the column will be lost.
  - Added the required column `tip_text` to the `tip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tip" DROP COLUMN "text",
ADD COLUMN     "tip_text" TEXT NOT NULL;
