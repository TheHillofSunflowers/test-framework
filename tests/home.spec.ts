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
    test.beforeEach(async ({ homePage }) => {
        // Navigate to a different page
        await homePage.navigateToShorts();
        await homePage.clickHomeButton();
    });

    test('Home Button navigates to home page', async({ homePage }) => {
        await expect(homePage.page).toHaveURL(await homePage.regex());
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Home Button does not navigate to incorrect page', async({ homePage }) => {
        // Initialize RegExp for homepage URL with any additional characters at the end
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);
        await expect(homePage.page).not.toHaveURL(urlPattern);
        await expect(homePage.page).not.toHaveTitle(/.+ - YouTube$/);
    });
});

test('Get Started Message is visible on landing', async({ homePage }) => {
    await expect(homePage.getStartedTitle).toBeVisible();
    await expect(homePage.getStartedSubtitle).toBeVisible();
});