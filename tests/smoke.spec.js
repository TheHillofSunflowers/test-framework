// @ts-check
const { test, expect } = require('@playwright/test');


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

    test('Search', async({ page }) => {
        await page.getByPlaceholder('Search').fill('test');
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await page.getByRole('button', { name: 'Search', exact: true }).click(); // Two separate clicks for it to go through
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/results\?search_query=test/);
    });

    test('Settings', async({ page }) => {
        await page.locator('#buttons').getByLabel('Settings').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\//);
    });

    test('Log In + Feed Section', async({ page }) => {
        await page.getByLabel('Sign in').click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?accounts\.google\.com\/.*$/);
        /*await page.getByLabel('Email or phone').fill('muzunewt@gmail.com');
        await page.getByLabel('Email or phone').press('Enter');
        await page.getByLabel('Password').fill('schoolloop');
        await page.getByLabel('Password').press('Enter');
        await page.goto('https://www.youtube.com/');*/

        await page.goto('https://www.youtube.com/');
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
