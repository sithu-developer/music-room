/*
  Warnings:

  - Added the required column `adminId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "adminId" INTEGER;

UPDATE "User" SET "adminId" = 1;

ALTER TABLE "User" ALTER COLUMN "adminId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
