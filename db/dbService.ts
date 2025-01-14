import { PrismaClient } from '@prisma/client';
import { MatchDataOdds, MatchInfo } from '../scraper/types';

const prisma = new PrismaClient();

export async function cleanDatabase() {
  try {
    console.log('Cleaning database...');
    await prisma.bookmaker.deleteMany({});
    await prisma.match.deleteMany({});
    console.log('Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveMatchInfo(matchInfo: MatchInfo) {
  return prisma.match.upsert({
    where: { matchId: matchInfo.matchId },
    update: {},
    create: matchInfo,
  });
}

export async function saveMatchOdds(matchDataOdds: MatchDataOdds) {
  const { matchId, bookmakers } = matchDataOdds;

  for (const bookmaker of bookmakers) {
    const existingOdds = await prisma.bookmaker.findFirst({
      where: {
        matchId,
        name: bookmaker.name,
      },
    });

    const newOdds = {
      home: bookmaker.oddsValues.home,
      draw: bookmaker.oddsValues.draw,
      away: bookmaker.oddsValues.away,
    };

    if (
      !existingOdds ||
      existingOdds.oddsHome !== newOdds.home ||
      existingOdds.oddsDraw !== newOdds.draw ||
      existingOdds.oddsAway !== newOdds.away
    ) {
      await prisma.bookmaker.upsert({
        where: {
          matchId_name: {
            matchId,
            name: bookmaker.name,
          },
        },
        update: {
          oddsHome: newOdds.home,
          oddsDraw: newOdds.draw,
          oddsAway: newOdds.away,
        },
        create: {
          matchId,
          name: bookmaker.name,
          oddsHome: newOdds.home,
          oddsDraw: newOdds.draw,
          oddsAway: newOdds.away,
        },
      });

      await prisma.oddsHistory.create({
        data: {
          matchId,
          bookmaker: bookmaker.name,
          oddsHome: newOdds.home,
          oddsDraw: newOdds.draw,
          oddsAway: newOdds.away,
        },
      });
    }
  }
}
