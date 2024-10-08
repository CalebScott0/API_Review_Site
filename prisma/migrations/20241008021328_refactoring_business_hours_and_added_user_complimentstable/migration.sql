/*
  Warnings:

  - Changed the type of `close_time` on the `business_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `open_time` on the `business_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "business_hours" DROP COLUMN "close_time",
ADD COLUMN     "close_time" TIME(2) NOT NULL,
DROP COLUMN "open_time",
ADD COLUMN     "open_time" TIME(2) NOT NULL;
