/*
  Warnings:

  - You are about to drop the column `timeText` on the `Match` table. All the data in the column will be lost.
  - Added the required column `time` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "timeText",
ADD COLUMN     "time" TEXT NOT NULL;
