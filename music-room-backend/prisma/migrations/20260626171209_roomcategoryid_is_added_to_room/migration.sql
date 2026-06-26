/*
  Warnings:

  - Added the required column `roomCategoryId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomCategoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomCategoryId_fkey" FOREIGN KEY ("roomCategoryId") REFERENCES "RoomCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
