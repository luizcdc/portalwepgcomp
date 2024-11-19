/*
  Warnings:

  - The primary key for the `Certificate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `Certificate` table. All the data in the column will be lost.
  - The primary key for the `Evaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `committeeId` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `workId` on the `Evaluation` table. All the data in the column will be lost.
  - The primary key for the `Presentation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `duration` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `room` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the column `workId` on the `Presentation` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Committee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctoralStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Work` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventEditionId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluationCriteriaId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionWithinBlock` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentationBlockId` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionId` to the `Presentation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Presentation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

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
ALTER TABLE "Work" DROP CONSTRAINT "Work_professorId_fkey";

-- DropIndex
DROP INDEX "Presentation_workId_key";

-- AlterTable
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_pkey",
DROP COLUMN "eventId",
ADD COLUMN     "eventEditionId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Certificate_id_seq";

-- AlterTable
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_pkey",
DROP COLUMN "committeeId",
DROP COLUMN "expertise",
DROP COLUMN "grade",
DROP COLUMN "workId",
ADD COLUMN     "evaluationCriteriaId" TEXT NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "submissionId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Evaluation_id_seq";

-- AlterTable
ALTER TABLE "Presentation" DROP CONSTRAINT "Presentation_pkey",
DROP COLUMN "duration",
DROP COLUMN "endTime",
DROP COLUMN "location",
DROP COLUMN "room",
DROP COLUMN "startTime",
DROP COLUMN "workId",
ADD COLUMN     "positionWithinBlock" VARCHAR(255) NOT NULL,
ADD COLUMN     "presentationBlockId" TEXT NOT NULL,
ADD COLUMN     "submissionId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PresentationStatus" NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Presentation_id_seq";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Committee";

-- DropTable
DROP TABLE "DoctoralStudent";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Professor";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Work";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "registrationNumber" VARCHAR(20),
    "photoFilePath" VARCHAR(255),
    "profile" "Profile" NOT NULL DEFAULT 'DoctoralStudent',
    "level" "UserLevel" NOT NULL DEFAULT 'Default',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventEdition" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "callForPapersText" TEXT NOT NULL,
    "partnersText" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "submissionDeadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isEvaluationRestrictToLoggedUsers" BOOLEAN NOT NULL DEFAULT true,
    "presentationDuration" INTEGER NOT NULL DEFAULT 20,
    "presentationsPerPresentationBlock" INTEGER NOT NULL DEFAULT 6,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeMember" (
    "id" TEXT NOT NULL,
    "eventEditionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "CommitteeLevel" NOT NULL,
    "role" "CommitteeRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommitteeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCriteria" (
    "id" TEXT NOT NULL,
    "eventEditionId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "weightRadio" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "mainAuthorId" TEXT NOT NULL,
    "eventEditionId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "abstract" TEXT NOT NULL,
    "pdfFile" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "linkedinUrl" VARCHAR(255),
    "ranking" INTEGER,
    "status" "SubmissionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panelist" (
    "id" TEXT NOT NULL,
    "presentationBlockId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "PanelistStatus" NOT NULL DEFAULT 'Confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwardedPanelist" (
    "eventEditionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardedPanelist_pkey" PRIMARY KEY ("eventEditionId","userId")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "eventEditionId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentationBlock" (
    "id" TEXT NOT NULL,
    "eventEditionId" TEXT NOT NULL,
    "roomId" TEXT,
    "type" "PresentationBlockType" NOT NULL,
    "title" VARCHAR(255),
    "speakerName" VARCHAR(255),
    "startTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresentationBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoAuthor" (
    "id" TEXT NOT NULL,
    "submisionId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_registrationNumber_key" ON "UserAccount"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeMember_eventEditionId_userId_key" ON "CommitteeMember"("eventEditionId", "userId");

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_eventEditionId_fkey" FOREIGN KEY ("eventEditionId") REFERENCES "EventEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluationCriteriaId_fkey" FOREIGN KEY ("evaluationCriteriaId") REFERENCES "EvaluationCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_mainAuthorId_fkey" FOREIGN KEY ("mainAuthorId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_eventEditionId_fkey" FOREIGN KEY ("eventEditionId") REFERENCES "EventEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panelist" ADD CONSTRAINT "Panelist_presentationBlockId_fkey" FOREIGN KEY ("presentationBlockId") REFERENCES "PresentationBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panelist" ADD CONSTRAINT "Panelist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AwardedPanelist" ADD CONSTRAINT "AwardedPanelist_eventEditionId_fkey" FOREIGN KEY ("eventEditionId") REFERENCES "EventEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AwardedPanelist" ADD CONSTRAINT "AwardedPanelist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_eventEditionId_fkey" FOREIGN KEY ("eventEditionId") REFERENCES "EventEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_eventEditionId_fkey" FOREIGN KEY ("eventEditionId") REFERENCES "EventEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_presentationBlockId_fkey" FOREIGN KEY ("presentationBlockId") REFERENCES "PresentationBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoAuthor" ADD CONSTRAINT "CoAuthor_submisionId_fkey" FOREIGN KEY ("submisionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
