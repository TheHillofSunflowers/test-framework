// @ts-check
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/home-page');

test.describe('Home Button', () => {
    test('E2E Home Button', async({ page }) => {
        await page.goto('https://www.youtube.com/');
        await page.locator('#start').getByLabel('Guide').click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        await page.locator('#guide-content #button').click();
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\//);
    });

    test('E2E Home Button Negative', async({ page }) => {
        await page.goto('https://www.youtube.com/');
        await page.locator('#start').getByLabel('Guide').click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        await page.locator('#guide-content #button').click();
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        const re = RegExp(/^https?:\/\/(www\.)?youtube\.com\/.+$/);
        await expect(page).not.toHaveURL(re);
    });

    test('Get Started Message', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.getStartedTitle).toBeVisible();
        await expect(homePage.getStartedSubtitle).toBeVisible();
    });

    test('Chips Count', async({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.login();
        let chipsList = await homePage.chipsList();
        /*let count = 0;
        for (let i in homePage.chipsList) {
            count++;
        }
        await expect(count).toBeGreaterThanOrEqual(15);*/
        //await homePage.chipsList.click();
        await expect(chipsList).toHaveLength(21);
    });
});