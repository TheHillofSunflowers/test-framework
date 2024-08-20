import { test as base, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';

const test = base.extend<{ homePage: HomePage }>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    }
});

test.describe('Smoke Suite', () => {
    test('Home Button navigates to home', async({ homePage }) => {
        await homePage.homeButton.click();
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Hamburger Home Button navigates to home', async({ homePage }) => {
        await homePage.openGuideMenu();
        await homePage.navigateToGuideItem('Home');
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Hamburger Subscriptions navigates to subscriptions page', async({ homePage }) => {
        await homePage.openGuideMenu();
        await homePage.navigateToGuideItem('Subscriptions');
        await expect(homePage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/feed\/subscriptions/);
        await expect(homePage.page).toHaveTitle("Subscriptions - YouTube");
    });

    test('Subscriptions page Log In Message is visible', async({ homePage }) => {
        await expect(await homePage.getLoginButton()).toBeVisible(); // Validate that User is not logged in
        await homePage.page.goto('https://www.youtube.com/feed/subscriptions');
        await expect(homePage.page.locator('.image > .yt-icon-shape > div > svg')).toBeVisible(); // Logo is visible
        await expect(homePage.page.getByText('Don’t miss new videos')).toBeVisible();
        await expect(homePage.page.getByText('Sign in to see updates from your favorite YouTube channels')).toBeVisible();
        await expect(homePage.page.locator('#page-manager').getByLabel('Sign in')).toBeVisible(); // Sign in button is visible
    });

    test('Settings button leads to Google log in page', async({ homePage }) => {
        await homePage.page.locator('#buttons').getByLabel('Settings').click();
        await homePage.page.locator('tp-yt-paper-item').filter({ hasText: 'Settings' }).click();
        await expect(homePage.page).not.toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
        await expect(homePage.page).toHaveTitle("YouTube");
    });
});