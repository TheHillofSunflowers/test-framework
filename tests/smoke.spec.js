// @ts-check
const { test, expect } = require('@playwright/test');
const { SearchResultsPage } = require('./pages/search-results-page');
const { HomePage } = require('./pages/home-page');

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.youtube.com/');
});

test.describe('Smoke Suite', () => {

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
        //const firstResult = await searchResultsPage.firstThumbnail();
        //await firstResult.waitFor({ state: 'visible' });
        //await page.locator('ytd-reel-shelf-renderer #contents').nth(0).waitFor({ state: 'visible' });
        await searchResultsPage.searchButton.hover();
        await page.mouse.wheel(0, 10);
        //const searchResultsList = await page.locator('ytd-item-section-renderer div ytd-video-renderer').locator('#ytd-item-section-renderer');
        const searchResultsList = await page.locator('#contents ytd-video-renderer').all();
        //const searchResultsList = await searchResultsPage.searchResultsList();
        console.log(searchResultsList.length);
        for(const i in searchResultsList) {
            await searchResultsList[i].locator('#dismissible a').nth(0).hover();
            console.log(await searchResultsList[i].locator('#dismissible a').nth(0).getAttribute('id'));
            await expect(await searchResultsList[i].locator('#dismissible a').nth(0)).toHaveId('thumbnail');
            console.log(await searchResultsList[i].locator('#dismissible a').nth(0).getAttribute('href'));
            await expect(await searchResultsList[i].locator('#dismissible a').nth(0)).toHaveAttribute('href', /watch\?v=.+$/);
            console.log(await searchResultsList[i].locator('#dismissible a').nth(0).getAttribute('img'));
            await expect(await searchResultsList[i].locator('#dismissible a yt-image img').nth(0)).toBeVisible();
        }
    });

    test('Settings', async({ page }) => {
        await page.locator('#buttons').getByLabel('Settings').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    });
});