/*
  Warnings:

  - You are about to drop the column `awardDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `resultDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `submissionDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - Added the required column `endSubmissionDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEvaluationRestrictToLoggedUsers` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentationDuration` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentationsPerSession` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startSubmissionDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `startDate` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_eventId_fkey";

-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "awardDate",
DROP COLUMN "resultDate",
DROP COLUMN "submissionDate",
ADD COLUMN     "endSubmissionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isEvaluationRestrictToLoggedUsers" BOOLEAN NOT NULL,
ADD COLUMN     "presentationDuration" TEXT NOT NULL,
ADD COLUMN     "presentationsPerSession" INTEGER NOT NULL,
ADD COLUMN     "startSubmissionDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf";
