// @ts-check
const { expect } = require('@playwright/test');
//require('dotenv').config();

exports.Page = class Page {
    constructor(page) {
        this.page = page;
        this.homeButton = page.locator('#start').getByRole('link', { name: 'YouTube Home' });
        this.guide = page.locator('#start').getByLabel('Guide');
    }

    /*async goto() {
        await this.page.goto('/');
    }*/

    async login() {
        await this.page.getByLabel('Sign in').click();
        await expect(this.page).toHaveURL(/^https?:\/\/(www\.)?accounts\.google\.com\/.*$/);
        let user = /*process.env.playwrightUsername ??*/ 'solorioth@gmail.com';
        await this.page.getByLabel('Email or phone').fill(user);
        await this.page.getByLabel('Email or phone').press('Enter');
        await this.page.waitForLoadState();
        let pass = /*process.env.playwrightPassword ??*/ 'testcase123';
        await this.page.getByLabel('Enter your password').fill(pass);
        await this.page.getByLabel('Enter your password').press('Enter');
        await this.page.waitForLoadState();
        // Pop ups
        await this.page.addLocatorHandler(this.page.getByText('Confirm your recovery email'), async () => {
            await this.page.getByText('Confirm your recovery email').click();
        });
        await this.page.addLocatorHandler(this.page.getByText('Enter recovery email address'), async () => {
            const recoveryEmail = /*process.env.recoveryEmail ??*/ 'muzunewt@gmail.com';
            await this.page.getByLabel('Enter recovery email address').fill(recoveryEmail);
            await this.page.getByLabel('Enter recovery email address').press('Enter');
        });
        await this.page.addLocatorHandler(this.page.getByText('Not now'), async () => {
            await this.page.getByText('Not now').click();
        });
        await this.page.addLocatorHandler(this.page.getByText('Not now'), async () => {
            await this.page.getByText('Not now').click();
        });
        await this.page.waitForURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    }
}