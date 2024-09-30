-- DropForeignKey
ALTER TABLE "photo_business" DROP CONSTRAINT "photo_business_business_id_fkey";

-- AddForeignKey
ALTER TABLE "photo_business" ADD CONSTRAINT "photo_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
