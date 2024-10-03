-- DropForeignKey
ALTER TABLE "business_attributes" DROP CONSTRAINT "business_attributes_business_id_fkey";

-- DropForeignKey
ALTER TABLE "business_hours" DROP CONSTRAINT "business_hours_business_id_fkey";

-- DropForeignKey
ALTER TABLE "category_business" DROP CONSTRAINT "category_business_business_id_fkey";

-- DropForeignKey
ALTER TABLE "photo_business" DROP CONSTRAINT "photo_business_business_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_business_id_fkey";

-- DropForeignKey
ALTER TABLE "tip" DROP CONSTRAINT "tip_business_id_fkey";
