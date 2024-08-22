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
        await homePage.navigateToGuideItem('Shorts');
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

test.describe('Offline page test', () => {
    test.beforeEach(async({ homePage }) => {
        // Set browser context to offline
        await homePage.page.context().setOffline(true);
    
        // Reload home page
        await homePage.clickHomeButton();
    });

    test('Assert offline message and network response is blocked', async({ homePage }) => {
        // Assert offline message is visisble
        await expect(homePage.page.getByText('Connect to the internet')).toBeVisible();
    
        // Click Retry button
        await expect(homePage.page.getByLabel('Retry')).toBeVisible();
        await homePage.page.getByLabel('Retry').click();
    
        // Expect network response to be blocked
        const responses = await homePage.page.waitForResponse('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {timeout: 1000}).catch(() => null);
        expect(responses).toBeNull();
    
        // Recheck UI
        await expect(homePage.page.getByText('Connect to the internet')).toBeVisible();
    });
    
    test('Assert that the offline Retry button will receive a status 200 response when online', async({ homePage}) => {
        // Set browser context to offline
        await homePage.page.context().setOffline(true);
    
        // Reload home page
        await homePage.clickHomeButton();
    
        // Set browser context online
        await homePage.page.context().setOffline(false);

        // Intercept network request to delay autoreload so we can test the retry button
        await homePage.page.route('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', route => {
            route.continue();
        });
    
        // Click Retry button
        await homePage.page.getByLabel('Retry').click();
    
        // Assert that network response was successful
        const responses = await homePage.page.waitForResponse('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false');
        expect(responses.status()).toBe(200);

        // Check that the response came from the appropriate request
        const request = responses.request();
        expect(request.url()).toContain('/youtubei/v1/browse?prettyPrint=false');
        expect(request.failure()).toBeNull();
    
        // Assert home page is back online
        await expect(homePage.getStartedTitle).toBeVisible();
    });
})