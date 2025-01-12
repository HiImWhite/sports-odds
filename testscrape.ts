// src/testScrape.ts
import { scrapeOdds } from './scraper/flashscoreScraper';
// If your function is in the same file, you can just call it directly.

async function main() {
  try {
    const object = await scrapeOdds();
    console.log(
      'Scrape complete! Got results and odds:',
      object.results,
      JSON.stringify(object.matchDataOdds, null, 2)
    );
  } catch (err) {
    console.error('Scrape failed:', err);
  }
}

// Entry point
main();
