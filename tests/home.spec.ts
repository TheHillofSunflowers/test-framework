import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';

test.describe('Home Button', () => {

    test('E2E Home Button navigates to home page', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.navigateToShorts();

        await homePage.clickHomeButton();
        await expect(page).toHaveURL(await homePage.regex());
        await expect(page).toHaveTitle("YouTube");
    });

    test('E2E Home Button navigates to home page - Negative', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.navigateToShorts();

        await homePage.clickHomeButton();
        // Initialize RegExp for homepage URL with any additional characters at the end
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);
        await expect(page).not.toHaveURL(urlPattern);
        await expect(page).not.toHaveTitle(new RegExp(`'.+ - YouTube$'`));
    });

    test('Get Started Message is visible on landing', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.getStartedTitle).toBeVisible();
        await expect(homePage.getStartedSubtitle).toBeVisible();
    });
});