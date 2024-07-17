// @ts-check
const { test, expect } = require('@playwright/test');
const { SearchResultsPage } = require('./pages/search-results-page');
const { HomePage } = require('./pages/home-page');

test.describe('Smoke Suite', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.youtube.com/');
    });

    test('Home Button', async({ page }) => {
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    });

    test('Hamburger Home', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    });

    test('Hamburger Subscriptions', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Subscriptions' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/subscriptions/);
    });

    test('Search', async({ page }) => {
        const searchResultsPage = new SearchResultsPage(page);
        await searchResultsPage.searchQuery();
        let re = await searchResultsPage.regex();
        await expect(page).toHaveURL(re);
    });

    test('Search and Assert Clickable Thumbnail', async({ page }) => {
        const searchResultsPage = new SearchResultsPage(page);
        await searchResultsPage.goto();
        const searchResultsList = await searchResultsPage.searchResultsList();
        for(let i in searchResultsList) {
            await expect(searchResultsList[i].locator('a')).toHaveId('thumbnail');
            await expect(searchResultsList[i].locator('a')).toHaveAttribute('href', /watch\?v=.+$/);
            await expect(searchResultsList[i].locator('img')).toBeVisible();
        }
    });

    test('Settings', async({ page }) => {
        await page.locator('#buttons').getByLabel('Settings').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    });
});