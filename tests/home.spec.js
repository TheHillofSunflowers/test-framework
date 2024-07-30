// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/home-page');

test.describe('Home Button', () => {
    
    test('E2E Home Button', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.navigateToShorts();

        await homePage.homeButton.click();
        await expect(page).toHaveURL(await homePage.regex());
        await expect(page).toHaveTitle("YouTube");
    });

    test('E2E Home Button Negative', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.navigateToShorts();

        await homePage.homeButton.click();
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);
        await expect(page).not.toHaveURL(urlPattern);
        await expect(page).not.toHaveTitle(new RegExp(`'.+$ - YouTube'`));
    });

    test('Get Started Message', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.getStartedTitle).toBeVisible();
        await expect(homePage.getStartedSubtitle).toBeVisible();
    });
});