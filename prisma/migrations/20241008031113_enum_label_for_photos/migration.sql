/*
  Warnings:

  - The values [drink,food,inside,menu,outside] on the enum `photo_label` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "photo_label_new" AS ENUM ('DRINK', 'FOOD', 'INSIDE', 'MENU', 'OUTSIDE');
ALTER TABLE "photo_business" ALTER COLUMN "label" TYPE "photo_label_new" USING ("label"::text::"photo_label_new");
ALTER TYPE "photo_label" RENAME TO "photo_label_old";
ALTER TYPE "photo_label_new" RENAME TO "photo_label";
DROP TYPE "photo_label_old";
COMMIT;
