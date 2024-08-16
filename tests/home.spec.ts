import { test as base, expect } from '@playwright/test';
import { HomePage } from './pages/home-page';

const test = base.extend<{ homePage: HomePage }>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await use(homePage);
    }
});

test.describe('Home Button', () => {

    test('E2E Home Button navigates to home page', async({ homePage }) => {
        await homePage.navigateToShorts();

        await homePage.clickHomeButton();
        await expect(homePage.page).toHaveURL(await homePage.regex());
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('E2E Home Button navigates to home page - Negative', async({ homePage }) => {
        await homePage.navigateToShorts();

        await homePage.clickHomeButton();
        // Initialize RegExp for homepage URL with any additional characters at the end
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);
        await expect(homePage.page).not.toHaveURL(urlPattern);
        await expect(homePage.page).not.toHaveTitle(new RegExp(`'.+ - YouTube$'`));
    });

    test('Get Started Message is visible on landing', async({ homePage }) => {
        await expect(homePage.getStartedTitle).toBeVisible();
        await expect(homePage.getStartedSubtitle).toBeVisible();
    });
});