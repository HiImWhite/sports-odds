import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import getFormattedDay from '../../../utils/utils';
import NodeCache from 'node-cache';
import { Bookmaker, MatchInfo, OddsHistory } from '../../../src/scraper/types';

const prisma = new PrismaClient();
const cache = new NodeCache({ stdTTL: 60 });

export default async function matchRoutes(app: FastifyInstance) {
  // Route to get all matches
  app.get('/matches', async (_, reply) => {
    try {
      const cachedMatches = cache.get('matches');
      const todayFormatted = getFormattedDay();

      if (cachedMatches) {
        return cachedMatches;
      }

      const matches = await prisma.match.findMany({
        select: {
          league: true,
          host: true,
          guest: true,
          matchId: true,
          time: true,
        },
        orderBy: {
          time: 'asc',
        },
      });

      const todayMatches = matches.filter((match: MatchInfo) =>
        match.matchId.includes(todayFormatted)
      );

      cache.set('matches', matches);

      return todayMatches;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch matches.' });
    }
  });

  // Route to get all matches in league
  app.get('/matches/league', async (request, reply) => {
    try {
      const { league } = request.query as { league?: string };

      if (!league) {
        return reply
          .status(400)
          .send({ error: 'League parameter is required for this endpoint.' });
      }

      const cacheKey = `matches_${league}`;
      const cachedMatches = cache.get(cacheKey);

      if (cachedMatches) {
        return cachedMatches;
      }

      const matches = await prisma.match.findMany({
        where: { league },
        select: {
          league: true,
          host: true,
          guest: true,
          matchId: true,
          time: true,
        },
        orderBy: {
          time: 'asc',
        },
      });

      cache.set(cacheKey, matches, 60);

      return matches;
    } catch (error) {
      app.log.error(error);
      return reply
        .status(500)
        .send({ error: 'Failed to fetch matches by league.' });
    }
  });

  // Route to get detailed pre-match odds for a given match
  app.get('/match/:matchId', async (request, reply) => {
    const { matchId } = request.params as { matchId: string };

    try {
      const cachedMatch = cache.get(matchId);
      if (cachedMatch) {
        return cachedMatch;
      }

      const match = await prisma.match.findUnique({
        where: { matchId },
        include: {
          bookmakers: true,
          oddsHistory: true,
        },
      });

      if (!match) {
        return reply.status(404).send({ error: 'Match not found' });
      }

      const response = {
        date: match.time,
        league: match.league,
        host: match.host,
        guest: match.guest,
        bookmakers: match.bookmakers.map(
          (bookmaker): Bookmaker => ({
            name: bookmaker.name,
            odds: {
              home: bookmaker.oddsHome,
              draw: bookmaker.oddsDraw,
              away: bookmaker.oddsAway,
            },
          })
        ),
        oddsHistory: match.oddsHistory.map(
          (history): OddsHistory => ({
            bookmaker: history.bookmaker,
            odds: {
              home: history.oddsHome,
              draw: history.oddsDraw,
              away: history.oddsAway,
            },
            timestamp: history.createdAt,
          })
        ),
      };

      cache.set(matchId, response, 60);

      return response;
    } catch (error) {
      app.log.error(error);
      return reply
        .status(500)
        .send({ error: 'Failed to fetch match details.' });
    }
  });
}
