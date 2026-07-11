/*
  Warnings:

  - Added the required column `height` to the `Roommates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Roommates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Roommates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Roommates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Roommates" DROP CONSTRAINT "Roommates_userId_fkey";

-- AlterTable
ALTER TABLE "Roommates" ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "width" TEXT NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Roommates" ADD CONSTRAINT "Roommates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
