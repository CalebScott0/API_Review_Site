/*
  Warnings:

  - A unique constraint covering the columns `[author_id,business_id]` on the table `review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_author_id_business_id_key" ON "review"("author_id", "business_id");
