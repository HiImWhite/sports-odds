import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = fastify({ logger: true });
const prisma = new PrismaClient();

app.get('/leagues', async (_, reply) => {
  try {
    const leagues = await prisma.match.findMany({
      select: { league: true },
      distinct: ['league'],
    });
    return leagues;
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: 'Failed to fetch leagues' });
  }
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
