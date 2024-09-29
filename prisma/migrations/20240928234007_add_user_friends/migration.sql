-- CreateTable
CREATE TABLE "user_friends" (
    "user_id" TEXT NOT NULL,
    "friends" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "user_friends_user_id_key" ON "user_friends"("user_id");
