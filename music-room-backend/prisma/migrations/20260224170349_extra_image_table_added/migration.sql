/*
  Warnings:

  - You are about to drop the column `gifImageUrl` on the `RoomImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomImage" DROP COLUMN "gifImageUrl";

-- CreateTable
CREATE TABLE "ExtraImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "roomImageId" INTEGER NOT NULL,

    CONSTRAINT "ExtraImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExtraImage" ADD CONSTRAINT "ExtraImage_roomImageId_fkey" FOREIGN KEY ("roomImageId") REFERENCES "RoomImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
