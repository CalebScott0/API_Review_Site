-- CreateTable
CREATE TABLE "tips" (
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" VARCHAR(100) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tips_author_id_business_id_key" ON "tips"("author_id", "business_id");

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
