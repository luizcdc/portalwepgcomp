/*
  Warnings:

  - A unique constraint covering the columns `[event_edition_id]` on the table `guidance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `event_edition_id` on table `guidance` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "admin_approval_status" AS ENUM ('Pending', 'Approved', 'Rejected');

-- DropForeignKey
ALTER TABLE "awarded_panelist" DROP CONSTRAINT "awarded_panelist_event_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "awarded_panelist" DROP CONSTRAINT "awarded_panelist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "committee_member" DROP CONSTRAINT "committee_member_event_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "committee_member" DROP CONSTRAINT "committee_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluation" DROP CONSTRAINT "evaluation_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "guidance" DROP CONSTRAINT "guidance_event_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "panelist" DROP CONSTRAINT "panelist_presentation_block_id_fkey";

-- DropForeignKey
ALTER TABLE "panelist" DROP CONSTRAINT "panelist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "presentation" DROP CONSTRAINT "presentation_presentation_block_id_fkey";

-- DropForeignKey
ALTER TABLE "room" DROP CONSTRAINT "room_event_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "submission" DROP CONSTRAINT "submission_event_edition_id_fkey";

-- DropForeignKey
ALTER TABLE "submission" DROP CONSTRAINT "submission_main_author_id_fkey";

-- AlterTable
ALTER TABLE "guidance" ALTER COLUMN "event_edition_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_verification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_verification_token" TEXT,
    "email_verified_at" TIMESTAMP(3),
    "email_verification_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_user_id_key" ON "email_verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_email_verification_token_key" ON "email_verification"("email_verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "guidance_event_edition_id_key" ON "guidance"("event_edition_id");

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_main_author_id_fkey" FOREIGN KEY ("main_author_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panelist" ADD CONSTRAINT "panelist_presentation_block_id_fkey" FOREIGN KEY ("presentation_block_id") REFERENCES "presentation_block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panelist" ADD CONSTRAINT "panelist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awarded_panelist" ADD CONSTRAINT "awarded_panelist_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awarded_panelist" ADD CONSTRAINT "awarded_panelist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation_block" ADD CONSTRAINT "presentation_block_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation" ADD CONSTRAINT "presentation_presentation_block_id_fkey" FOREIGN KEY ("presentation_block_id") REFERENCES "presentation_block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance" ADD CONSTRAINT "guidance_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
