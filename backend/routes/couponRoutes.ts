import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function couponRoutes(app: FastifyInstance) {
  // Route to calculate odds of ako coupon for specific matches
  app.post('/ako-coupon', async (request, reply) => {
    const { coupon } = request.body as {
      coupon: { matchId: string; oddType: 'home' | 'draw' | 'away' }[];
    };

    if (!coupon || coupon.length === 0) {
      return reply.status(400).send({ error: 'Coupon data is required.' });
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
          where: { matchId },
        });

        if (!bookmakerOdds) {
          return reply
            .status(404)
            .send({ error: `No odds found for matchId: ${matchId}` });
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
