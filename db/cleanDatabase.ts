import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('Cleaning database...');

    // Delete records from child tables first
    await prisma.oddsHistory.deleteMany({});
    await prisma.bookmaker.deleteMany({});
    await prisma.match.deleteMany({});

    console.log('Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase().catch((error) => {
  console.error(error);
  prisma.$disconnect();
});
