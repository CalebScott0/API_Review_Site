/*
  Warnings:

  - You are about to drop the `photo_businesses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "photo_businesses" DROP CONSTRAINT "photo_businesses_business_id_fkey";

-- DropTable
DROP TABLE "photo_businesses";

-- CreateTable
CREATE TABLE "business_photos" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "label" "photo_label_type" NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "business_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_photos_business_id_idx" ON "business_photos"("business_id");

-- AddForeignKey
ALTER TABLE "business_photos" ADD CONSTRAINT "business_photos_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
