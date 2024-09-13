import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures'

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
});

test.describe('Home Button', () => {
    test.beforeEach(async ({ homePage }) => {
        // Navigate to a different page, in this case Shorts
        await homePage.navigateToGuideItem('Shorts');

        // Click YouTube logo home button
        await homePage.clickHomeButton();
    });

    test('Home Button navigates to home page', async({ homePage }) => {
        // Assert navigation to the Home page
        await expect(homePage.page).toHaveURL(await homePage.regex());

        // Assert proper title
        await expect(homePage.page).toHaveTitle("YouTube");
    });

    test('Home Button does not navigate to incorrect page', async({ homePage }) => {
        // Initialize RegExp for homepage URL with any additional characters at the end
        const urlPattern = new RegExp(`${(await homePage.regex()).source} + '.+$'`);

        // Assert URL is not a different page
        await expect(homePage.page).not.toHaveURL(urlPattern);

        // Assert title is not a different title
        await expect(homePage.page).not.toHaveTitle(/.+ - YouTube$/);
    });
});

test('Get Started Message is visible on landing', async({ homePage }) => {
    // Assert Get Started message
    await expect(homePage.getStartedTitle).toBeVisible();

    // Assert Get started subtitle
    await expect(homePage.getStartedSubtitle).toBeVisible();
});

test.describe('Offline page test', () => {
    test.beforeEach(async({ homePage }) => {
        // Set browser context to offline
        console.log('Turning network connection off...');
        await homePage.page.context().setOffline(true);
    
        // Reload home page
        await homePage.clickHomeButton();
    });

    test('Assert offline message and network response is blocked', async({ homePage }) => {
        // Assert offline message is visisble
        const offlineMessage = homePage.page.getByText('Connect to the internet');
        await expect(offlineMessage).toBeVisible();
    
        // Wait for response event
        const responsePromise = homePage.page.waitForResponse('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {timeout: 1000}).catch(() => null);

        // Click Retry button
        console.log('Clicking Retry button...');
        await expect(homePage.retryConnectionButton).toBeVisible();
        await homePage.retryConnectionButton.click();
    
        // Expect network response to be blocked
        const response = await responsePromise;
        expect(response).toBeNull();
    
        // Recheck UI
        await expect(offlineMessage).toBeVisible();
    });
    
    test('Assert that the offline Retry button will receive a status 200 response when online', async({ homePage}) => {
        // Set browser context to online
        console.log('Turning network connection on...');
        await homePage.page.context().setOffline(true);
    
        // Reload home page
        await homePage.clickHomeButton();
    
        // Set browser context online
        await homePage.page.context().setOffline(false);

        // Wait for response event
        const responsePromise = homePage.page.waitForResponse('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false');
    
        // Click Retry button, catch if button has already been detached due to automatic reconnection
        console.log('Attempting to click Retry button...');
        await homePage.retryConnectionButton.click({timeout: 3000}).catch(async() => await expect(homePage.retryConnectionButton).toBeAttached({attached: false}));
    
        // Assert network response was successful
        const response = await responsePromise;
        expect(response.status()).toBe(200);

        // Check that the response came from the appropriate request
        const request = response.request();
        expect(request.url()).toContain('/youtubei/v1/browse?prettyPrint=false');
        expect(request.failure()).toBeNull();
    
        // Assert home page is back online
        await expect(homePage.getStartedTitle).toBeVisible();
    });
})