-- DropForeignKey
ALTER TABLE "business_attributes" DROP CONSTRAINT "business_attributes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_hours" DROP CONSTRAINT "business_hours_business_id_fkey";

-- DropForeignKey
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_business_id_fkey";

-- DropForeignKey
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_category_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_author_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_business_id_fkey";

-- DropForeignKey
ALTER TABLE "tip" DROP CONSTRAINT "tip_business_id_fkey";

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
