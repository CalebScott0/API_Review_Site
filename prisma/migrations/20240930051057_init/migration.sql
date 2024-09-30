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
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "average_stars" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "user_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "funny" INTEGER NOT NULL DEFAULT 0,
    "cool" INTEGER NOT NULL DEFAULT 0,
    "fans" INTEGER NOT NULL DEFAULT 0,
    "friends" TEXT[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "useful" INTEGER NOT NULL DEFAULT 0,
    "funny" INTEGER NOT NULL DEFAULT 0,
    "cool" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "comment_text" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_business" (
    "category_name" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "photo_business" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "caption" TEXT,
    "label" TEXT,

    CONSTRAINT "photo_business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip" (
    "author_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tip_text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "business_hours" (
    "business_id" TEXT NOT NULL,
    "monday" TEXT,
    "tuesday" TEXT,
    "wednesday" TEXT,
    "thursday" TEXT,
    "friday" TEXT,
    "saturday" TEXT,
    "sunday" TEXT
);

-- CreateTable
CREATE TABLE "business_attributes" (
    "business_id" TEXT NOT NULL,
    "accepts_insurance" TEXT,
    "alcohol" TEXT,
    "ambience" TEXT,
    "byob" TEXT,
    "byob_corkage" TEXT,
    "best_nights" TEXT,
    "bike_parking" TEXT,
    "business_accepts_bitcoin" TEXT,
    "business_accepts_credit_cards" TEXT,
    "business_parking" TEXT,
    "by_appointment_only" TEXT,
    "caters" TEXT,
    "coat_check" TEXT,
    "corkage" TEXT,
    "dogs_allowed" TEXT,
    "drive_thru" TEXT,
    "good_for_dancing" TEXT,
    "good_for_kids" TEXT,
    "good_for_meal" TEXT,
    "hair_speciality" TEXT,
    "happy_hour" TEXT,
    "has_tv" TEXT,
    "music" TEXT,
    "noise_level" TEXT,
    "outdooor_seating" TEXT,
    "restaurant_attire" TEXT,
    "restaurant_delivery" TEXT,
    "restaurant_good_for_groups" TEXT,
    "restaurant_price_range" TEXT,
    "restaurant_reservations" TEXT,
    "restaurant_table_service" TEXT,
    "restaurant_take_out" TEXT,
    "smoking" TEXT,
    "wheelchair_accessible" TEXT,
    "wifi" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_business_business_id_category_id_key" ON "category_business"("business_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tip_author_id_business_id_key" ON "tip"("author_id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_business_id_key" ON "business_hours"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_attributes_business_id_key" ON "business_attributes"("business_id");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_business" ADD CONSTRAINT "category_business_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip" ADD CONSTRAINT "tip_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
