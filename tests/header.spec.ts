import { test as base, expect } from '@playwright/test';
import { test } from './fixtures/fixtures'

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
});

test.describe('YouTube Header Tests', () => {
    test('Home Button navigates to home', async({ homePage }) => {
        // Click YouTube logo home button
        await homePage.clickHomeButton();

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
        await homePage.navigateToGuideItem('Subscriptions');

        // Assert logo is visible
        const logoSVG = homePage.page.locator('.image > .yt-icon-shape > div > svg');
        await expect(logoSVG).toBeVisible();

        // Assert log in prompt is visible
        const title = homePage.page.getByText('Don’t miss new videos');
        await expect(title).toBeVisible();

        const subtitle = homePage.page.getByText('Sign in to see updates from your favorite YouTube channels');
        await expect(subtitle).toBeVisible();

        // Assert sign in button is visible
        const signInButton = homePage.page.locator('#page-manager').getByLabel('Sign in');
        await expect(signInButton).toBeVisible();
    });

    test('Settings button leads to Google log in page', async({ homePage }) => {
        // Open settings menu
        console.log('Opening settings menu...');
        const settingsMenuButton = homePage.page.locator('#buttons').getByLabel('Settings');
        await settingsMenuButton.click();

        // Click settings button
        console.log('Clicking Settings button...');
        const settingsButton = homePage.page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' });
        await settingsButton.click();

        // Assert navigation by URL change
        await expect(homePage.page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);

        // Assert title is for YouTube
        await expect(homePage.page).toHaveTitle("YouTube");
    });
});