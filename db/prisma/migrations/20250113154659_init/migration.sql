/*
  Warnings:

  - You are about to drop the column `matchDate` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `Odds` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[matchId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeText` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchDate",
DROP COLUMN "status",
DROP COLUMN "timestamp",
ADD COLUMN     "matchId" INTEGER NOT NULL,
ADD COLUMN     "timeText" TEXT NOT NULL;

-- DropTable
DROP TABLE "Odds";

-- CreateTable
CREATE TABLE "Bookmaker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "oddsHome" TEXT NOT NULL,
    "oddsDraw" TEXT NOT NULL,
    "oddsAway" TEXT NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchId_key" ON "Match"("matchId");

-- AddForeignKey
ALTER TABLE "Bookmaker" ADD CONSTRAINT "Bookmaker_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;
