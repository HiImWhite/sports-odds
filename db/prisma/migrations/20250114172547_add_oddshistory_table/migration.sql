-- DropForeignKey
ALTER TABLE "Bookmaker" DROP CONSTRAINT "Bookmaker_matchId_fkey";

-- AlterTable
ALTER TABLE "Bookmaker" ALTER COLUMN "matchId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "matchId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "OddsHistory" (
    "id" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "bookmaker" TEXT NOT NULL,
    "oddsHome" TEXT NOT NULL,
    "oddsDraw" TEXT NOT NULL,
    "oddsAway" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OddsHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bookmaker" ADD CONSTRAINT "Bookmaker_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OddsHistory" ADD CONSTRAINT "OddsHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("matchId") ON DELETE CASCADE ON UPDATE CASCADE;
