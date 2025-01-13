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
    await prisma.bookmaker.create({
      data: {
        name: bookmaker.name,
        oddsHome: bookmaker.oddsValues.home,
        oddsDraw: bookmaker.oddsValues.draw,
        oddsAway: bookmaker.oddsValues.away,
        match: {
          connect: { matchId },
        },
      },
    });
  }
}
