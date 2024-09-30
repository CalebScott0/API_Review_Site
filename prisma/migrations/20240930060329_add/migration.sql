-- AddForeignKey
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
