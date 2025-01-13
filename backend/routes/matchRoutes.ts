import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function matchRoutes(app: FastifyInstance) {
  app.get('/matches', async (request, reply) => {
    try {
      const { league } = request.query as { league?: string };

      const matches = await prisma.match.findMany({
        where: league ? { league } : {},
        select: {
          league: true,
          host: true,
          guest: true,
          timeText: true,
        },
      });

      return matches;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch matches.' });
    }
  });
}
