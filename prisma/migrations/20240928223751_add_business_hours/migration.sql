-- CreateTable
CREATE TABLE "business_hours" (
    "business_id" TEXT NOT NULL,
    "monday" TEXT NOT NULL,
    "tuesday" TEXT NOT NULL,
    "wednesday" TEXT NOT NULL,
    "thursday" TEXT NOT NULL,
    "friday" TEXT NOT NULL,
    "saturday" TEXT NOT NULL,
    "sunday" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_business_id_key" ON "business_hours"("business_id");

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
