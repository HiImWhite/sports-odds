import { test, expect } from '@playwright/test';

const MOCK_URL = 'https://www.flashscore.pl/';

test.describe('Flashscore scraper', () => {
  test('should load the page and find matches', async ({ page }) => {
    await page.goto(MOCK_URL);

    expect(await page.title()).not.toBeNull();

    const calendar = page.locator('.calendar__datepicker');
    expect(await calendar.count()).toBeGreaterThan(0);
  });

  test('should navigate through website', async ({ page }) => {
    await page.goto(MOCK_URL);

    const soccerSection = page.locator('.sportName.soccer');
    await expect(soccerSection.first()).toBeVisible();
  });
});
