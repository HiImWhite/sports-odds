/*
  Warnings:

  - A unique constraint covering the columns `[matchId,name]` on the table `Bookmaker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_matchId_name_key" ON "Bookmaker"("matchId", "name");
