-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_author_id_fkey";

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
