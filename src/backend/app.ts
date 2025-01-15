import fastify from 'fastify';
import matchRoutes from './routes/matchRoutes';
import couponRoutes from './routes/couponRoutes';

const app = fastify({ logger: true });

app.register(matchRoutes);
app.register(couponRoutes);

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
