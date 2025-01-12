import { chromium, Page } from 'playwright';
import { Results, MatchDataOdds } from './types';

const results: Results[] = [];
const matchDataOdds: MatchDataOdds[] = [];

async function scrapeBookmakers(page: Page, matchId: number) {
  await page.waitForSelector('.oddsRowContent', { timeout: 10000 });
  const oddsRows = page.locator('.oddsRowContent');
  const rowCount = await oddsRows.count();

  let matchEntry = matchDataOdds.find((entry) => entry.matchId === matchId);

  if (!matchEntry) {
    matchEntry = {
      matchId: matchId,
      bookmakers: [],
    };
    matchDataOdds.push(matchEntry);
  }

  for (let i = 0; i < rowCount; i++) {
    const row = oddsRows.nth(i);

    const bookmakerElem = row.locator('.bookmaker a');
    const bookmakerName =
      (await bookmakerElem.getAttribute('title'))?.trim() || '';

    const cells = row.locator('.cellWrapper');
    const oddsHome =
      (await cells.nth(0).getAttribute('title'))?.split('»')[1]?.trim() ||
      'Not available';
    const oddsDraw =
      (await cells.nth(1).getAttribute('title'))?.split('»')[1]?.trim() ||
      'Not available';
    const oddsAway =
      (await cells.nth(2).getAttribute('title'))?.split('»')[1]?.trim() ||
      'Not available';

    console.log(
      `MatchId: ${matchId} Bookmaker: ${bookmakerName} => H: ${oddsHome}, D: ${oddsDraw}, A: ${oddsAway}`
    );

    matchEntry.bookmakers.push({
      name: bookmakerName,
      oddsValues: {
        home: oddsHome,
        draw: oddsDraw,
        away: oddsAway,
      },
    });
  }
  return matchDataOdds;
}

export async function scrapeOdds() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let matchId: number;

  try {
    await page.goto('https://www.flashscore.pl/');

    const soccerSection = page.locator('.sportName.soccer');
    await soccerSection.first().waitFor();

    const sectionCount = await soccerSection.count();
    console.log('Found sections:', sectionCount);

    for (let i = 0; i < sectionCount; i++) {
      const container = soccerSection.nth(i);

      const elements = container.locator(
        '.wclLeagueHeader, .event__match--scheduled'
      );
      const elementCount = await elements.count();

      let currentLeague = '';

      for (let j = 0; j < elementCount; j++) {
        const child = elements.nth(j);
        matchId = j;

        const classAttr = (await child.getAttribute('class')) || '';
        if (classAttr.includes('wclLeagueHeader--noCheckBox')) {
          const showMoreButton = child.locator('.wclIcon__leagueShowMoreCont');
          await showMoreButton.click();
        }

        const leagueHeader = child.locator('.event__title');
        const leagueHeaderCount = await leagueHeader.count();
        if (leagueHeaderCount) {
          const leagueLink = leagueHeader.locator('.event__titleBox a');
          const leagueName =
            (await leagueLink.getAttribute('aria-label'))?.trim() || '';
          currentLeague = leagueName;
          console.log('League name:', currentLeague);
          continue;
        }

        const betElem = child.locator('.liveBetWrapper');
        if ((await betElem.count()) === 0) {
          continue;
        }

        const scheduledBet = betElem.getByTestId('wcl-badgeLiveBet-scheduled');
        if ((await scheduledBet.count()) === 0) {
          continue;
        }

        const timeElem = child.locator('.event__time');
        const timeText = ((await timeElem.textContent()) || '').trim();
        if (timeText.includes('TWK')) {
          continue;
        }

        const homeElem = child.locator('.event__homeParticipant');
        const awayElem = child.locator('.event__awayParticipant');
        const host = ((await homeElem.textContent()) || '').trim();
        const guest = ((await awayElem.textContent()) || '').trim();

        const linkElem = child.locator('.eventRowLink');
        const href = await linkElem.getAttribute('href');

        await page.goto(href || '');
        await page.waitForLoadState('domcontentloaded');

        await scrapeBookmakers(page, matchId);

        await page.goBack();
        await page.waitForSelector('.event__match--scheduled', {
          timeout: 10000,
        });

        results.push({
          id: matchId,
          league: currentLeague,
          host,
          guest,
          timeText,
        });
      }
    }

    console.log(`Scraped ${results.length} matches`);
    return { results, matchDataOdds };
  } catch (error) {
    console.error('Error scrapping Flashscore: ', error);
    throw error;
  } finally {
    await browser.close();
  }
}
