-- CreateEnum
CREATE TYPE "profile" AS ENUM ('DoctoralStudent', 'Professor', 'Listener');

-- CreateEnum
CREATE TYPE "user_level" AS ENUM ('Superadmin', 'Admin', 'Default');

-- CreateEnum
CREATE TYPE "committee_level" AS ENUM ('Committee', 'Coordinator');

-- CreateEnum
CREATE TYPE "committee_role" AS ENUM ('OrganizingCommittee', 'StudentVolunteers', 'AdministativeSupport', 'Communication', 'ITSupport');

-- CreateEnum
CREATE TYPE "presentation_status" AS ENUM ('ToPresent', 'Presented', 'NotPresented');

-- CreateEnum
CREATE TYPE "submission_status" AS ENUM ('Submitted', 'Confirmed', 'Rejected');

-- CreateEnum
CREATE TYPE "panelist_status" AS ENUM ('Pending', 'Confirmed', 'Rejected', 'Present', 'Missing');

-- CreateEnum
CREATE TYPE "presentation_block_type" AS ENUM ('General', 'Presentation');

-- CreateTable
CREATE TABLE "user_account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "registration_number" VARCHAR(20),
    "photo_file_path" VARCHAR(255),
    "profile" "profile" NOT NULL DEFAULT 'DoctoralStudent',
    "level" "user_level" NOT NULL DEFAULT 'Default',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_edition" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "call_for_papers_text" TEXT NOT NULL,
    "partners_text" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "submission_start_date" TIMESTAMP(3) NOT NULL,
    "submission_deadline" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_evaluation_restrict_to_logged_users" BOOLEAN NOT NULL DEFAULT true,
    "presentation_duration" INTEGER NOT NULL DEFAULT 20,
    "presentations_per_presentation_block" INTEGER NOT NULL DEFAULT 6,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committee_member" (
    "id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level" "committee_level" NOT NULL,
    "role" "committee_role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "committee_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_criteria" (
    "id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "weight_radio" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "evaluation_criteria_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "advisor_id" TEXT NOT NULL,
    "main_author_id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "abstract" TEXT NOT NULL,
    "pdf_file" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "proposed_presentation_block_id" TEXT,
    "proposed_position_within_block" INTEGER,
    "co_advisor" VARCHAR(255),
    "status" "submission_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panelist" (
    "id" TEXT NOT NULL,
    "presentation_block_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "panelist_status" NOT NULL DEFAULT 'Confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awarded_panelist" (
    "event_edition_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "awarded_panelist_pkey" PRIMARY KEY ("event_edition_id","user_id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentation_block" (
    "id" TEXT NOT NULL,
    "event_edition_id" TEXT NOT NULL,
    "room_id" TEXT,
    "type" "presentation_block_type" NOT NULL,
    "title" VARCHAR(255),
    "speaker_name" VARCHAR(255),
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentation_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presentation" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "presentation_block_id" TEXT NOT NULL,
    "position_within_block" INTEGER NOT NULL,
    "status" "presentation_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "public_average_score" DOUBLE PRECISION,
    "evaluators_average_score" DOUBLE PRECISION,

    CONSTRAINT "presentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guidance" (
    "id" TEXT NOT NULL,
    "summary" TEXT,
    "authors_guidance" TEXT,
    "reviewers_guidance" TEXT,
    "audience_guidance" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_edition_id" TEXT,

    CONSTRAINT "guidance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PresentationToUserAccount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_registration_number_key" ON "user_account"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "committee_member_event_edition_id_user_id_key" ON "committee_member"("event_edition_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_PresentationToUserAccount_AB_unique" ON "_PresentationToUserAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_PresentationToUserAccount_B_index" ON "_PresentationToUserAccount"("B");

-- AddForeignKey
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committee_member" ADD CONSTRAINT "committee_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_evaluation_criteria_id_fkey" FOREIGN KEY ("evaluation_criteria_id") REFERENCES "evaluation_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_main_author_id_fkey" FOREIGN KEY ("main_author_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panelist" ADD CONSTRAINT "panelist_presentation_block_id_fkey" FOREIGN KEY ("presentation_block_id") REFERENCES "presentation_block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panelist" ADD CONSTRAINT "panelist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awarded_panelist" ADD CONSTRAINT "awarded_panelist_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awarded_panelist" ADD CONSTRAINT "awarded_panelist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation" ADD CONSTRAINT "presentation_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation" ADD CONSTRAINT "presentation_presentation_block_id_fkey" FOREIGN KEY ("presentation_block_id") REFERENCES "presentation_block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance" ADD CONSTRAINT "guidance_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PresentationToUserAccount" ADD CONSTRAINT "_PresentationToUserAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "presentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PresentationToUserAccount" ADD CONSTRAINT "_PresentationToUserAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
