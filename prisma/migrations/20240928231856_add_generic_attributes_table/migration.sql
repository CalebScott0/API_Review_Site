/*
  Warnings:

  - You are about to drop the `attributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "attributes";

-- CreateTable
CREATE TABLE "business_attributes" (
    "business_id" TEXT NOT NULL,
    "accepts_insurance" BOOLEAN NOT NULL DEFAULT false,
    "alcohol" TEXT,
    "ambience" TEXT,
    "byob" BOOLEAN NOT NULL DEFAULT false,
    "byob_corkage" TEXT,
    "best_nights" TEXT,
    "bike_parking" BOOLEAN NOT NULL DEFAULT false,
    "business_accepts_bitcoin" BOOLEAN NOT NULL DEFAULT false,
    "business_accepts_credit_cards" BOOLEAN NOT NULL DEFAULT false,
    "business_parking" TEXT,
    "by_appointment_only" BOOLEAN NOT NULL DEFAULT false,
    "caters" BOOLEAN NOT NULL DEFAULT false,
    "coat_check" BOOLEAN NOT NULL DEFAULT false,
    "corkage" BOOLEAN NOT NULL DEFAULT false,
    "dogs_allowed" BOOLEAN NOT NULL DEFAULT false,
    "drive_thru" BOOLEAN NOT NULL DEFAULT false,
    "good_for_dancing" BOOLEAN NOT NULL DEFAULT false,
    "good_for_kids" BOOLEAN NOT NULL DEFAULT false,
    "good_for_meal" TEXT,
    "hair_speciality" TEXT,
    "happy_hour" BOOLEAN NOT NULL DEFAULT false,
    "has_tv" BOOLEAN NOT NULL DEFAULT false,
    "music" TEXT,
    "noise_level" TEXT,
    "outdooor_seating" BOOLEAN NOT NULL DEFAULT false,
    "restaurant_attire" TEXT,
    "restaurant_delivery" BOOLEAN NOT NULL DEFAULT false,
    "restaurant_good_for_groups" BOOLEAN NOT NULL DEFAULT false,
    "restaurant_price_range" TEXT,
    "restaurant_reservations" BOOLEAN NOT NULL DEFAULT false,
    "restaurant_table_service" BOOLEAN NOT NULL DEFAULT false,
    "restaurant_take_out" BOOLEAN NOT NULL DEFAULT false,
    "smoking" TEXT,
    "wheelchair_accessible" BOOLEAN NOT NULL DEFAULT false,
    "wifi" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "business_attributes_business_id_key" ON "business_attributes"("business_id");
