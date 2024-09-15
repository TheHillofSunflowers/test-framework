import { test } from '../fixtures/fixtures';
import fs from 'fs';

test.use({ headless: false });

test('Manual login and save state', async({ homePage }) => {
    // Click Log in button
    await homePage.goto();
    console.log('Clicking Log In button...');
    await (await homePage.getLoginButton()).click();

    // Pause for manual login, press resume or enter playwright.resume() in DevTools
    await homePage.page.pause();

    // Save cookies and local storage
    console.log('Grabbing cookies and local storage...');
    const cookies = await homePage.page.context().cookies();
    const localStorage = await homePage.page.evaluate(() => JSON.stringify(window.localStorage));

    // Save the state to a file
    console.log('Saving cookies and local storage...');
    fs.writeFileSync('tests/auth/cookies.json', JSON.stringify(cookies));
    fs.writeFileSync('tests/auth/localStorage.json', localStorage);
});