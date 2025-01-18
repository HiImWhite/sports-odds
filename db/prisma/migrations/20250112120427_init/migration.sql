-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Odds" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "bookmaker" TEXT NOT NULL,
    "homeOdds" DOUBLE PRECISION NOT NULL,
    "drawOdds" DOUBLE PRECISION NOT NULL,
    "awayOdds" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Odds_pkey" PRIMARY KEY ("id")
);
