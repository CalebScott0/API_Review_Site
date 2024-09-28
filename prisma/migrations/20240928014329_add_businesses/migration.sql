-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "average_stars" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "state" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);
