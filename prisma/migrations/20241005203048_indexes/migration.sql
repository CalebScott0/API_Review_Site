-- CreateIndex
CREATE INDEX "review_author_id_created_at_idx" ON "review"("author_id", "created_at");
