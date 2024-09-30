-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
