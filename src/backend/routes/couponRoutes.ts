import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function couponRoutes(app: FastifyInstance) {
  app.post('/ako-coupon', async (request, reply) => {
    // Route to calculate odds of ako coupon for specific matches
    const { coupon, bookmakerName } = request.body as {
      coupon: { matchId: string; oddType: 'home' | 'draw' | 'away' }[];
      bookmakerName: string;
    };

    if (!coupon || coupon.length === 0) {
      return reply.status(400).send({ error: 'Coupon data is required.' });
    }

    if (!bookmakerName) {
      return reply.status(400).send({ error: 'Bookmaker name is required.' });
    }

    try {
      const results: {
        matchId: string;
        bookmaker: string;
        odd: {
          type: string;
          number: number;
        };
      }[] = [];

      for (const { matchId, oddType } of coupon) {
        const bookmakerOdds = await prisma.bookmaker.findFirst({
          where: { matchId, name: bookmakerName },
        });

        if (!bookmakerOdds) {
          return reply.status(404).send({
            error: `No odds found for matchId: ${matchId} with bookmaker: ${bookmakerName}`,
          });
        }

        const oddsValue =
          bookmakerOdds[
            `odds${oddType.charAt(0).toUpperCase() + oddType.slice(1)}` as
              | 'oddsHome'
              | 'oddsDraw'
              | 'oddsAway'
          ];

        results.push({
          matchId,
          bookmaker: bookmakerOdds.name,
          odd: {
            type: oddType,
            number: parseFloat(oddsValue),
          },
        });
      }

      const totalOdds = results.reduce((acc, item) => acc * item.odd.number, 1);

      return {
        results,
        totalOdds: totalOdds.toFixed(2),
      };
    } catch (error) {
      app.log.error(error);
      return reply
        .status(500)
        .send({ error: 'Failed to calculate AKO coupon.' });
    }
  });
}
