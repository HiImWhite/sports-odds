/*
  Warnings:

  - You are about to drop the column `awayTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `awayOdds` on the `Odds` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Odds` table. All the data in the column will be lost.
  - You are about to drop the column `drawOdds` on the `Odds` table. All the data in the column will be lost.
  - You are about to drop the column `homeOdds` on the `Odds` table. All the data in the column will be lost.
  - Added the required column `guest` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `host` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `league` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oddsAway` to the `Odds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oddsDraw` to the `Odds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oddsHome` to the `Odds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayTeam",
DROP COLUMN "createdAt",
DROP COLUMN "homeTeam",
ADD COLUMN     "guest" TEXT NOT NULL,
ADD COLUMN     "host" TEXT NOT NULL,
ADD COLUMN     "league" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Odds" DROP COLUMN "awayOdds",
DROP COLUMN "createdAt",
DROP COLUMN "drawOdds",
DROP COLUMN "homeOdds",
ADD COLUMN     "oddsAway" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "oddsDraw" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "oddsHome" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
