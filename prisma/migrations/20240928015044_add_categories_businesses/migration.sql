-- CreateTable
CREATE TABLE "categories_businesses" (
    "category_name" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_businesses_business_id_category_id_key" ON "categories_businesses"("business_id", "category_id");

-- AddForeignKey
ALTER TABLE "categories_businesses" ADD CONSTRAINT "categories_businesses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_businesses" ADD CONSTRAINT "categories_businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
