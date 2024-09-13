import { test } from '@playwright/test';
import { HomePage } from './pages/home-page';
import fs from 'fs';

test.use({ headless: false });

test('Manual login and save state', async({ page }) => {
    const homePage = new HomePage(page);

    // Click Log in button
    await homePage.goto();
    console.log('Clicking Log In button...');
    await (await homePage.getLoginButton()).click();

    // Pause for manual login, press resume or enter playwright.resume() in DevTools
    await page.pause();

    // Save cookies and local storage
    console.log('Grabbing cookies and local storage...');
    const cookies = await page.context().cookies();
    const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));

    // Save the state to a file
    console.log('Saving cookies and local storage...');
    fs.writeFileSync('cookies.json', JSON.stringify(cookies));
    fs.writeFileSync('localStorage.json', localStorage);
});