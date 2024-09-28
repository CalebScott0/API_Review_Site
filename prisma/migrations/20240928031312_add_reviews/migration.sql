-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "funny" INTEGER NOT NULL DEFAULT 0,
    "cool" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
