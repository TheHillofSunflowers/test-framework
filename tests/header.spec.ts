import { test as base, expect } from '@playwright/test';
import { test } from './fixtures/fixtures'

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
});

test.describe('YouTube Header Tests', () => {
    test('Home Button navigates to home', async({ homePage }) => {
        // Click YouTube logo home button
        await homePage.homeButton.click();

        // Assert appropriate URL
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);

        // Assert appropriate title
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Hamburger Home Button navigates to home', async({ homePage }) => {
        // Click Home button in the guide menu
        await homePage.navigateToGuideItem('Home');

        // Assert appropriate URL and title
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Hamburger Subscriptions navigates to subscriptions page', async({ homePage }) => {
        // Click Subscriptions button in the guide menu
        await homePage.navigateToGuideItem('Subscriptions');

        // Assert appropriate URL and title
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/subscriptions/);
        await expect(homePage.page).toHaveTitle("Subscriptions - YouTube");
    });

    test('Subscriptions page Log In Message is visible', async({ homePage }) => {
        // Validate that the User is not logged in
        await expect(await homePage.getLoginButton()).toBeVisible();

        // Navigate to Subscriptions page
        await homePage.page.goto('https://www.youtube.com/feed/subscriptions');

        // Assert logo is visible
        await expect(homePage.page.locator('.image > .yt-icon-shape > div > svg')).toBeVisible();

        // Assert log in prompt is visible
        await expect(homePage.page.getByText('Don’t miss new videos')).toBeVisible();
        await expect(homePage.page.getByText('Sign in to see updates from your favorite YouTube channels')).toBeVisible();

        // Assert sign in button is visible
        await expect(homePage.page.locator('#page-manager').getByLabel('Sign in')).toBeVisible();
    });

    test('Settings button leads to Google log in page', async({ homePage }) => {
        // Open settings menu
        await homePage.page.locator('#buttons').getByLabel('Settings').click();

        // Click settings button
        await homePage.page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();

        // Assert navigation by URL change
        await expect(homePage.page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);

        // Assert title is for YouTube
        await expect(homePage.page).toHaveTitle("YouTube");
    });
});