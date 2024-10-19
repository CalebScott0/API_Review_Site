/*
  Warnings:

  - You are about to drop the `business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category_business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photo_business` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_compliment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_attributes" DROP CONSTRAINT "business_attributes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_hours" DROP CONSTRAINT "business_hours_business_id_fkey";

-- DropForeignKey
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_business_id_fkey";

-- DropForeignKey
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_category_id_fkey";

-- DropForeignKey
ALTER TABLE "photo_business" DROP CONSTRAINT "photo_business_business_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_author_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_business_id_fkey";

-- DropForeignKey
ALTER TABLE "tip" DROP CONSTRAINT "tip_author_id_fkey";

-- DropForeignKey
ALTER TABLE "tip" DROP CONSTRAINT "tip_business_id_fkey";

-- DropForeignKey
ALTER TABLE "user_compliment" DROP CONSTRAINT "user_compliment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_friend" DROP CONSTRAINT "user_friend_friend_id_fkey";

-- DropForeignKey
ALTER TABLE "user_friend" DROP CONSTRAINT "user_friend_user_id_fkey";

-- DropTable
DROP TABLE "business";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "category_business";

-- DropTable
DROP TABLE "photo_business";

-- DropTable
DROP TABLE "review";

-- DropTable
DROP TABLE "tip";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_compliment";

-- DropTable
DROP TABLE "user_friend";

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "average_stars" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "state" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "average_stars" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "user_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "funny" INTEGER NOT NULL DEFAULT 0,
    "cool" INTEGER NOT NULL DEFAULT 0,
    "fans" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friends" (
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "friends_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_friends_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "user_compliments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "compliment_type" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_compliments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "funny" INTEGER NOT NULL DEFAULT 0,
    "cool" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_businesses" (
    "business_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "category_businesses_pkey" PRIMARY KEY ("business_id","category_id")
);

-- CreateTable
CREATE TABLE "photo_businesses" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "label" "photo_label_type" NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "photo_businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" TEXT NOT NULL,
    "tip_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_friends_user_id_idx" ON "user_friends"("user_id");

-- CreateIndex
CREATE INDEX "user_compliments_user_id_idx" ON "user_compliments"("user_id");

-- CreateIndex
CREATE INDEX "reviews_author_id_created_at_idx" ON "reviews"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_business_id_created_at_idx" ON "reviews"("business_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_author_id_business_id_key" ON "reviews"("author_id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "category_businesses_business_id_idx" ON "category_businesses"("business_id");

-- CreateIndex
CREATE INDEX "photo_businesses_business_id_idx" ON "photo_businesses"("business_id");

-- CreateIndex
CREATE INDEX "tips_author_id_created_at_idx" ON "tips"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "tips_business_id_created_at_idx" ON "tips"("business_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tips_author_id_business_id_key" ON "tips"("author_id", "business_id");

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_compliments" ADD CONSTRAINT "user_compliments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_businesses" ADD CONSTRAINT "category_businesses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_businesses" ADD CONSTRAINT "category_businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_businesses" ADD CONSTRAINT "photo_businesses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
