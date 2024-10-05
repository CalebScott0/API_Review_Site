-- CreateIndex
CREATE INDEX "comment_review_id_created_at_idx" ON "comment"("review_id", "created_at");

-- CreateIndex
CREATE INDEX "comment_author_id_created_at_idx" ON "comment"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "photo_business_business_id_idx" ON "photo_business"("business_id");

-- CreateIndex
CREATE INDEX "review_author_id_created_at_idx" ON "review"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "tip_business_id_created_at_idx" ON "tip"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "tip_author_id_created_at_idx" ON "tip"("author_id", "created_at");
