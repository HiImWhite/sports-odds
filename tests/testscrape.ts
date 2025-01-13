import { scrapeOdds } from '../scraper/flashscoreScraper';
import { cleanDatabase } from '../db/dbService';

async function main() {
  await cleanDatabase();
  await scrapeOdds();
}

main();
