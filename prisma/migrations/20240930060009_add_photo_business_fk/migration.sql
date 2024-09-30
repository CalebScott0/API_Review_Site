-- AddForeignKey
ALTER TABLE "photo_business" ADD CONSTRAINT "photo_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
