/*
  Warnings:

  - Added the required column `date` to the `Bookmaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmaker" DROP CONSTRAINT "Bookmaker_matchId_fkey";

-- DropForeignKey
ALTER TABLE "OddsHistory" DROP CONSTRAINT "OddsHistory_matchId_fkey";

-- DropIndex
DROP INDEX "Bookmaker_matchId_name_key";

-- AlterTable
ALTER TABLE "Bookmaker" ADD COLUMN     "date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "date" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Bookmaker" ADD CONSTRAINT "Bookmaker_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OddsHistory" ADD CONSTRAINT "OddsHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;
