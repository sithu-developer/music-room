/*
  Warnings:

  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "name",
ADD COLUMN     "companyName" TEXT NOT NULL DEFAULT 'Music Room';
