// @ts-check
const { expect } = require('@playwright/test');
//require('dotenv').config();

exports.Page = class Page {
    constructor(page) {
        this.page = page;
        this.homeButton = page.locator('#start').getByRole('link', { name: 'YouTube Home' });
        this.guide = page.locator('#start').getByLabel('Guide');
    }

    async goto() {
        await this.page.goto('/');
    }

    async login() {
        await this.page.getByLabel('Sign in').click();
        await expect(this.page).toHaveURL(/^https?:\/\/(www\.)?accounts\.google\.com\/.*$/);
        let user = /*process.env.playwrightUsername ??*/ 'solorioth@gmail.com';
        await this.page.getByLabel('Email or phone').fill(user);
        await this.page.getByLabel('Email or phone').press('Enter');
        let pass = /*process.env.playwrightPassword ??*/ 'testcase123';
        await this.page.getByLabel('Enter your password').fill(pass);
        await this.page.getByLabel('Enter your password').press('Enter');
        // Pop ups
        await this.page.getByText('Confirm your recovery email').click();
        await this.page.getByLabel('Enter recovery email address').click();
        const recoveryEmail = process.env.recoveryEmail ?? 'Set recoveryEmail Environment Variable in .env';
        await this.page.getByLabel('Enter recovery email address').fill(recoveryEmail);
        await this.page.getByLabel('Enter recovery email address').press('Enter');
        await this.page.getByText('Not now').click();
        await this.page.getByText('Not now').click();
        await this.page.waitForURL(/^https?:\/\/(www\.)?youtube\.com\/?/);
    }
}