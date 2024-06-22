// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Smoke Suite', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.youtube.com/');
    });

    test('Home Button', async({ page }) => {
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\//);
    });

    test('Hamburger Home', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\//);
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

    test('Feed Section', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('#sections').getByTitle('You', { exact: true }).getByRole('link').click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/you/);
        /*await page.getByRole('link', { name: 'Your Channel' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/channel\/.+$/);*/
        await page.locator('#start').getByLabel('Guide').click();
        await page.locator('#sections').getByTitle('History', { exact: true }).getByRole('link').click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/history/);
        /*await page.getByRole('link', { name: 'Playlists' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/playlists/);
        await page.getByRole('link', { name: 'Watch Later' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/playlist\?list=WL/);
        await page.getByRole('link', { name: 'Liked Videos' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/playlist\?list=LL/);
        await page.getByRole('link', { name: 'Your Clips' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/clips/);*/
    });
});