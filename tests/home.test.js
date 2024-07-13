// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/home-page');

test.describe('Home Button', () => {
    test('E2E Home Button', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.guide.click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        await homePage.guideCloseClick();
        await homePage.homeButton.click();
        await expect(page).toHaveURL(await homePage.regex());
    });

    test('E2E Home Button Negative', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.guide.click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        await homePage.guideCloseClick();
        await homePage.homeButton.click();
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);
        await expect(page).not.toHaveURL(urlPattern);
    });

    test('Get Started Message', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.getStartedTitle).toBeVisible();
        await expect(homePage.getStartedSubtitle).toBeVisible();
    });
});