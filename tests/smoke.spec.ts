import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.youtube.com/');
});

test.describe('Smoke Suite', () => {

    test('Home Button navigates to home', async({ page }) => {
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(page).toHaveTitle("YouTube");
    });

    test('Hamburger Home Button navigates to home', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click(); // Open Hamburger Guide menu
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(page).toHaveTitle("YouTube");
    });

    test('Hamburger Subscriptions navigates to subscriptions page', async({ page }) => {
        await page.locator('#start').getByLabel('Guide').click(); // Open Hamburger Guide menu
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Subscriptions' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/subscriptions/);
        await expect(page).toHaveTitle("Subscriptions - YouTube");
    });

    test('Subscriptions page Log In Message is visible', async({ page }) => {
        await page.goto('/');
        await expect(page.getByLabel('Sign in')).toBeVisible(); // Check if User is logged in
        await page.goto('https://www.youtube.com/feed/subscriptions');
        await expect(page.locator('.image > .yt-icon-shape > div > svg')).toBeVisible(); // Logo is visible
        await expect(page.getByText('Don’t miss new videos')).toBeVisible();
        await expect(page.getByText('Sign in to see updates from your favorite YouTube channels')).toBeVisible();
        await expect(page.locator('#page-manager').getByLabel('Sign in')).toBeVisible(); // Sign in button is visible
    });

    test('Settings button leads to Google log in page', async({ page }) => {
        await page.locator('#buttons').getByLabel('Settings').click();
        await page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(page).toHaveTitle("YouTube");
    });
});