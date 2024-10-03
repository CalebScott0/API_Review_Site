-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
