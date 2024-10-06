-- DropForeignKey
ALTER TABLE "user_friend" DROP CONSTRAINT "user_friend_friend_id_fkey";

-- DropIndex
DROP INDEX "user_friend_friend_id_key";

-- AddForeignKey
ALTER TABLE "user_friend" ADD CONSTRAINT "user_friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
