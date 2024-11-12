/*
  Warnings:

  - The `status` column on the `panelist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profile` column on the `user_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `user_account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `level` on the `committee_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `committee_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `presentation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `presentation_block` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
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

-- AlterTable
ALTER TABLE "committee_member" DROP COLUMN "level",
ADD COLUMN     "level" "committee_level" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "committee_role" NOT NULL;

-- AlterTable
ALTER TABLE "panelist" DROP COLUMN "status",
ADD COLUMN     "status" "panelist_status" NOT NULL DEFAULT 'Confirmed';

-- AlterTable
ALTER TABLE "presentation" DROP COLUMN "status",
ADD COLUMN     "status" "presentation_status" NOT NULL;

-- AlterTable
ALTER TABLE "presentation_block" DROP COLUMN "type",
ADD COLUMN     "type" "presentation_block_type" NOT NULL;

-- AlterTable
ALTER TABLE "submission" DROP COLUMN "status",
ADD COLUMN     "status" "submission_status" NOT NULL;

-- AlterTable
ALTER TABLE "user_account" DROP COLUMN "profile",
ADD COLUMN     "profile" "profile" NOT NULL DEFAULT 'DoctoralStudent',
DROP COLUMN "level",
ADD COLUMN     "level" "user_level" NOT NULL DEFAULT 'Default';

-- DropEnum
DROP TYPE "CommitteeLevel";

-- DropEnum
DROP TYPE "CommitteeRole";

-- DropEnum
DROP TYPE "PanelistStatus";

-- DropEnum
DROP TYPE "PresentationBlockType";

-- DropEnum
DROP TYPE "PresentationStatus";

-- DropEnum
DROP TYPE "Profile";

-- DropEnum
DROP TYPE "SubmissionStatus";

-- DropEnum
DROP TYPE "UserLevel";
