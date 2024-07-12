// @ts-check
const { test, expect } = require('@playwright/test');
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

    test('Hamburger Shorts', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.getByRole('link', { name: 'Shorts' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/shorts\/.*$/);
    });

    test('Hamburger Subscriptions', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Subscriptions' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/subscriptions/);
    });

    test('Search', async({ page }) => {
        await page.getByPlaceholder('Search').fill('test');
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await page.waitForLoadState();
        //await page.getByRole('button', { name: 'Search', exact: true }).click(); // Two separate clicks for it to go through
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/results\?search_query=test/);
    });

    test('Settings', async({ page }) => {
        await page.locator('#buttons').getByLabel('Settings').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    });

    test('Log In + Feed Section', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.login();
        await homePage.guide.click();
        await page.locator('#sections').getByTitle('You', { exact: true }).getByRole('link').click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/you/);
        /*await homePage.guide.click();
        await page.getByRole('link', { name: 'Your Channel' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/channel\/.+$/);*/
        await homePage.guide.click();
        await page.locator('#sections').getByTitle('History', { exact: true }).getByRole('link').click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/history/);
        await homePage.guide.click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Playlists' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/playlists/);
        await homePage.guide.click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Watch later' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/playlist\?list=WL/);
        await homePage.guide.click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Liked videos' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/playlist\?list=LL/);
    });
});