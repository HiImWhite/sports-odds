import cron from 'node-cron';
import { scrapeOdds } from './scraper/flashscoreScraper';

async function main() {
  try {
    console.log('Starting Flashscore scraper...');

    await scrapeOdds();

    console.log('Scraping completed successfully!');
  } catch (error) {
    console.error('Error running scraper:', error);
  }
}

main();

cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled scraper...');
  main();
});
