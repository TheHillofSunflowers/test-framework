import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures';

test.use({ javaScriptEnabled: false, headless: false });

test('Assert JavaScript disabled functionality', async({ homePage }) => {
    // Navigate to home page
    homePage.goto();

    // Assert menu icon is visible
    await expect(homePage.page.locator('#menu-icon')).toBeVisible();

    // Assert visual screenshot matches expected
    await expect(homePage.page).toHaveScreenshot('homeJSDisabled.png');
});

test('Assert Video Page JS Disabled', async({ videoPage }) => {
    // Navigate to video page
    videoPage.goto();

    // Assert menu icon is visible
    await expect(videoPage.page.locator('#menu-icon')).toBeVisible();

    // Assert visual screenshot matches expected
    await expect(videoPage.page).toHaveScreenshot('videoJSDisabled.png')
});