-- DropIndex
DROP INDEX "user_friend_user_id_friend_id_key";

-- AlterTable
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_pkey" PRIMARY KEY ("user_id", "friend_id");
