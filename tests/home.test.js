// @ts-check
const { test, expect } = require('@playwright/test');
const { assert } = require('console');

test.describe('Home Button', () => {
    test('E2E Home Button', async({ page }) => {
        await page.goto('https://www.youtube.com/');
        await page.locator('#start').getByLabel('Guide').click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        /*await setTimeout(waitForShorts, 1000);
        async function waitForShorts() {
            console.log('Waiting...');
            //page.getByRole('link', { name: 'YouTube Home' }).click();
        }*/

        await page.locator('#guide-content #button').click();
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        await expect(page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\//);
    });

    test('E2E Home Button Negative', async({ page }) => {
        await page.goto('https://www.youtube.com/');
        await page.locator('#start').getByLabel('Guide').click();
        await page.getByRole('link', { name: 'Shorts' }).click();

        /*await setTimeout(waitForShorts, 1000);
        async function waitForShorts() {
            console.log('Waiting...');
            //page.getByRole('link', { name: 'YouTube Home' }).click();
        }*/

        await page.locator('#guide-content #button').click();
        await page.locator('#start').getByRole('link', { name: 'YouTube Home' }).click();
        const re = RegExp(/^https?:\/\/(www\.)?youtube\.com\/.+$/);
        await expect(page).not.toHaveURL(re);
    });
});