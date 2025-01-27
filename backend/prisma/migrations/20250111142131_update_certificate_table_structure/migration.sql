/*
  Warnings:

  - You are about to drop the column `email` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `certificate` table. All the data in the column will be lost.
  - Added the required column `file_path` to the `certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `certificate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "guidance" DROP CONSTRAINT "guidance_event_edition_id_fkey";

-- AlterTable
ALTER TABLE "certificate" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "file_path" TEXT NOT NULL,
ADD COLUMN     "is_email_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance" ADD CONSTRAINT "guidance_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
