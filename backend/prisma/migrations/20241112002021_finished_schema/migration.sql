/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Committee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctoralStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Presentation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Work` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserLevel" AS ENUM ('Superadmin', 'Admin', 'Default');

-- CreateEnum
CREATE TYPE "CommitteeLevel" AS ENUM ('Committee', 'Coordinator');

-- CreateEnum
CREATE TYPE "CommitteeRole" AS ENUM ('OrganizingCommittee', 'StudentVolunteers', 'AdministativeSupport', 'Communication', 'ITSupport');

-- CreateEnum
CREATE TYPE "PresentationStatus" AS ENUM ('ToPresent', 'Presented', 'NotPresented');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Submitted', 'Confirmed', 'Rejected');

-- CreateEnum
CREATE TYPE "PanelistStatus" AS ENUM ('Pending', 'Confirmed', 'Rejected', 'Present', 'Missing');

-- CreateEnum
CREATE TYPE "PresentationBlockType" AS ENUM ('General', 'Presentation');

-- AlterEnum
ALTER TYPE "Profile" ADD VALUE 'Listener';

-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_workId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_professorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctoralStudent" DROP CONSTRAINT "DoctoralStudent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_committeeId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_workId_fkey";

-- DropForeignKey
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_workId_fkey";

-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_doctoralStudentId_fkey";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_professorId_fkey";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "Committee";

-- DropTable
DROP TABLE "DoctoralStudent";

-- DropTable
DROP TABLE "Evaluation";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Presentation";

-- DropTable
DROP TABLE "Professor";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Work";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "user_account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "registration_number" VARCHAR(20),
    "photo_file_path" VARCHAR(255),
    "profile" "Profile" NOT NULL DEFAULT 'DoctoralStudent',
    "level" "UserLevel" NOT NULL DEFAULT 'Default',
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
    "url" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "submission_deadline" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
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
    "level" "CommitteeLevel" NOT NULL,
    "role" "CommitteeRole" NOT NULL,
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
    "linkedin_url" VARCHAR(255),
    "ranking" INTEGER,
    "status" "SubmissionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panelist" (
    "id" TEXT NOT NULL,
    "presentation_block_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "PanelistStatus" NOT NULL DEFAULT 'Confirmed',
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
    "type" "PresentationBlockType" NOT NULL,
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
    "position_within_block" VARCHAR(255) NOT NULL,
    "status" "PresentationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "co_author" (
    "id" TEXT NOT NULL,
    "submision_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "co_author_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_registration_number_key" ON "user_account"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "committee_member_event_edition_id_user_id_key" ON "committee_member"("event_edition_id", "user_id");

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
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation" ADD CONSTRAINT "presentation_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentation" ADD CONSTRAINT "presentation_presentation_block_id_fkey" FOREIGN KEY ("presentation_block_id") REFERENCES "presentation_block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "co_author" ADD CONSTRAINT "co_author_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;