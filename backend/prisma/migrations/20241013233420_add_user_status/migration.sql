/*
  Warnings:

  - Changed the type of `status` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Teacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ATIVO', 'PENDENTE');

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL;
