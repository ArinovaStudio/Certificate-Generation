/*
  Warnings:

  - You are about to drop the column `candidateName` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "candidateName",
DROP COLUMN "department",
DROP COLUMN "endDate",
DROP COLUMN "position",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;
