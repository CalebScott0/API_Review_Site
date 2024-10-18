-- CreateEnum
CREATE TYPE "compliment_type" AS ENUM ('COOL', 'CUTE', 'FUNNY', 'HOT', 'LIST', 'MORE', 'NOTE', 'PHOTOS', 'PLAIN', 'PROFILE', 'WRITER');

-- CreateEnum
CREATE TYPE "photo_label_type" AS ENUM ('DRINK', 'FOOD', 'INSIDE', 'MENU', 'OUTSIDE');

-- CreateEnum
CREATE TYPE "day_of_week" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "alcohol_type" AS ENUM ('BEER_AND_WINE', 'FULL_BAR', 'NONE');

-- CreateEnum
CREATE TYPE "byob_corkage_type" AS ENUM ('YES_CORKAGE', 'YES_FREE', 'NONE');

-- CreateEnum
CREATE TYPE "noise_level_type" AS ENUM ('AVERAGE', 'LOUD', 'QUIET', 'VERY_LOUD', 'NONE');

-- CreateEnum
CREATE TYPE "restaurant_attire_type" AS ENUM ('CASUAL', 'DRESSY', 'FORMAL', 'NONE');

-- CreateEnum
CREATE TYPE "smoking_type" AS ENUM ('OUTDOOR', 'YES', 'NONE');

-- CreateEnum
CREATE TYPE "wifi_type" AS ENUM ('FREE', 'PAID', 'NONE');

-- CreateEnum
CREATE TYPE "ambience_type" AS ENUM ('TOURISTY', 'HIPSTER', 'ROMANTIC', 'DIVEY', 'INTIMATE', 'TRENDY', 'UPSCALE', 'CLASSY', 'CASUAL');

-- CreateEnum
CREATE TYPE "business_parking_type" AS ENUM ('GARAGE', 'LOT', 'STREET', 'VALET', 'VALIDATED');

-- CreateEnum
CREATE TYPE "meal_type" AS ENUM ('BREAKFAST', 'BRUNCH', 'DESSERT', 'DINNER', 'LATENIGHT', 'LUNCH');

-- CreateEnum
CREATE TYPE "hair_speciality_type" AS ENUM ('AFRICAN_AMERICAN', 'ASIAN', 'COLORING', 'CURLY', 'EXTENSIONS', 'KIDS', 'PERMS', 'STRAIGHT_PERMS');

-- CreateEnum
CREATE TYPE "music_type" AS ENUM ('BACKGROUND_MUSIC', 'DJ', 'JUKEBOX', 'KARAOKE', 'LIVE', 'NO_MUSIC', 'VIDEO');

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "average_stars" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "state" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "location" BYTEA NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
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

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friend" (
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "friends_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_friend_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "user_compliment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "compliment_type" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_compliment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
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

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_business" (
    "business_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "category_business_pkey" PRIMARY KEY ("business_id","category_id")
);

-- CreateTable
CREATE TABLE "photo_business" (
    "id" TEXT NOT NULL,
    "caption" TEXT,
    "label" "photo_label_type" NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "photo_business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip" (
    "id" TEXT NOT NULL,
    "tip_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "day_of_week" "day_of_week" NOT NULL,
    "open_time" TIME NOT NULL,
    "close_time" TIME NOT NULL,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_attributes" (
    "business_id" TEXT NOT NULL,
    "accepts_insurance" BOOLEAN,
    "alcohol" "alcohol_type",
    "bike_parking" BOOLEAN,
    "business_accepts_bitcoin" BOOLEAN,
    "business_accepts_credit_cards" BOOLEAN,
    "by_appointment_only" BOOLEAN,
    "byob" BOOLEAN,
    "byob_corkage" "byob_corkage_type",
    "caters" BOOLEAN,
    "coat_check" BOOLEAN,
    "corkage" BOOLEAN,
    "dogs_allowed" BOOLEAN,
    "drive_thru" BOOLEAN,
    "good_for_dancing" BOOLEAN,
    "good_for_kids" BOOLEAN,
    "happy_hour" BOOLEAN,
    "has_tv" BOOLEAN,
    "noise_level" "noise_level_type",
    "outdoor_seating" BOOLEAN,
    "restaurant_attire" "restaurant_attire_type",
    "restaurant_delivery" BOOLEAN,
    "restaurant_good_for_groups" BOOLEAN,
    "restaurant_price_range" INTEGER,
    "restaurant_reservations" BOOLEAN,
    "restaurant_table_service" BOOLEAN,
    "restaurant_take_out" BOOLEAN,
    "smoking" "smoking_type",
    "wheelchair_accessible" BOOLEAN,
    "wifi" "wifi_type"
);

-- CreateTable
CREATE TABLE "attribute_ambience" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "type" "ambience_type" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_ambience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_best_nights" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "day_of_week" "day_of_week" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_best_nights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_business_parking" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "type" "business_parking_type" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_business_parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_good_for_meal" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "type" "meal_type" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_good_for_meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_hair_speciality" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "type" "hair_speciality_type" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_hair_speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_music" (
    "id" TEXT NOT NULL,
    "business_attribute_id" TEXT NOT NULL,
    "type" "music_type" NOT NULL,
    "value" BOOLEAN NOT NULL,

    CONSTRAINT "attribute_music_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_friend_user_id_idx" ON "user_friend"("user_id");

-- CreateIndex
CREATE INDEX "user_compliment_user_id_idx" ON "user_compliment"("user_id");

-- CreateIndex
CREATE INDEX "review_author_id_created_at_idx" ON "review"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "review_business_id_created_at_idx" ON "review"("business_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "review_author_id_business_id_key" ON "review"("author_id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE INDEX "category_business_business_id_idx" ON "category_business"("business_id");

-- CreateIndex
CREATE INDEX "photo_business_business_id_idx" ON "photo_business"("business_id");

-- CreateIndex
CREATE INDEX "tip_author_id_created_at_idx" ON "tip"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "tip_business_id_created_at_idx" ON "tip"("business_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tip_author_id_business_id_key" ON "tip"("author_id", "business_id");

-- CreateIndex
CREATE INDEX "business_hours_business_id_idx" ON "business_hours"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_business_id_day_of_week_key" ON "business_hours"("business_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "business_attributes_business_id_key" ON "business_attributes"("business_id");

-- CreateIndex
CREATE INDEX "business_attributes_business_id_idx" ON "business_attributes"("business_id");

-- CreateIndex
CREATE INDEX "attribute_ambience_business_attribute_id_idx" ON "attribute_ambience"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_ambience_business_attribute_id_type_key" ON "attribute_ambience"("business_attribute_id", "type");

-- CreateIndex
CREATE INDEX "attribute_best_nights_business_attribute_id_idx" ON "attribute_best_nights"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_best_nights_business_attribute_id_day_of_week_key" ON "attribute_best_nights"("business_attribute_id", "day_of_week");

-- CreateIndex
CREATE INDEX "attribute_business_parking_business_attribute_id_idx" ON "attribute_business_parking"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_business_parking_business_attribute_id_type_key" ON "attribute_business_parking"("business_attribute_id", "type");

-- CreateIndex
CREATE INDEX "attribute_good_for_meal_business_attribute_id_idx" ON "attribute_good_for_meal"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_good_for_meal_business_attribute_id_type_key" ON "attribute_good_for_meal"("business_attribute_id", "type");

-- CreateIndex
CREATE INDEX "attribute_hair_speciality_business_attribute_id_idx" ON "attribute_hair_speciality"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_hair_speciality_business_attribute_id_type_key" ON "attribute_hair_speciality"("business_attribute_id", "type");

-- CreateIndex
CREATE INDEX "attribute_music_business_attribute_id_idx" ON "attribute_music"("business_attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_music_business_attribute_id_type_key" ON "attribute_music"("business_attribute_id", "type");

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_compliment" ADD CONSTRAINT "user_compliment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_business" ADD CONSTRAINT "photo_business_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_attributes" ADD CONSTRAINT "business_attributes_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_ambience" ADD CONSTRAINT "attribute_ambience_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_best_nights" ADD CONSTRAINT "attribute_best_nights_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_business_parking" ADD CONSTRAINT "attribute_business_parking_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_good_for_meal" ADD CONSTRAINT "attribute_good_for_meal_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_hair_speciality" ADD CONSTRAINT "attribute_hair_speciality_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_music" ADD CONSTRAINT "attribute_music_business_attribute_id_fkey" FOREIGN KEY ("business_attribute_id") REFERENCES "business_attributes"("business_id") ON DELETE CASCADE ON UPDATE CASCADE;
