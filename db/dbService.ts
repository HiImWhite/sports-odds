import { PrismaClient } from '@prisma/client';
import { MatchDataOdds, MatchInfo } from '../src/scraper/types';
import getFormattedDay from '../utils/utils';

const prisma = new PrismaClient();

export async function saveMatchInfo(matchInfo: MatchInfo) {
  const today = getFormattedDay();

  await prisma.match.upsert({
    where: { matchId: matchInfo.matchId },
    update: {
      league: matchInfo.league,
      host: matchInfo.host,
      guest: matchInfo.guest,
      time: matchInfo.time,
      date: today,
    },
    create: {
      ...matchInfo,
      date: today,
    },
  });
}

export async function saveMatchOdds(matchDataOdds: MatchDataOdds) {
  const today = getFormattedDay();

  for (const bookmaker of matchDataOdds.bookmakers) {
    await prisma.bookmaker.upsert({
      where: {
        matchId_name: {
          matchId: matchDataOdds.matchId,
          name: bookmaker.name,
        },
      },
      update: {
        oddsHome: bookmaker.oddsValues.home,
        oddsDraw: bookmaker.oddsValues.draw,
        oddsAway: bookmaker.oddsValues.away,
        date: today,
      },
      create: {
        matchId: matchDataOdds.matchId,
        name: bookmaker.name,
        oddsHome: bookmaker.oddsValues.home,
        oddsDraw: bookmaker.oddsValues.draw,
        oddsAway: bookmaker.oddsValues.away,
        date: today,
      },
    });

    // Save to OddsHistory table for tracking changes
    await prisma.oddsHistory.create({
      data: {
        matchId: matchDataOdds.matchId,
        bookmaker: bookmaker.name,
        oddsHome: bookmaker.oddsValues.home,
        oddsDraw: bookmaker.oddsValues.draw,
        oddsAway: bookmaker.oddsValues.away,
        createdAt: new Date(),
      },
    });
  }
}
