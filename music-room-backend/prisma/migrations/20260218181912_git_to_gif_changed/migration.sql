/*
  Warnings:

  - You are about to drop the column `gitImageUrl` on the `RoomImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomImage" DROP COLUMN "gitImageUrl",
ADD COLUMN     "gifImageUrl" TEXT;
