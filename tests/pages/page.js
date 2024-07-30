// @ts-check
const { expect } = require('@playwright/test');
//require('dotenv').config();

exports.Page = class Page {
    constructor(page) {
        this.page = page;
        this.homeButton = page.locator('#start').getByRole('link', { name: 'YouTube Home' });
        this.guide = page.locator('#start').getByLabel('Guide');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.voiceButton = page.getByLabel('Search with your voice');
    }

    async guideClose() {
        return this.page.locator('#guide-content #button');
    }

    async login() {
        return this.page.getByLabel('Sign in');
    }

    async accountMenu() {
        return this.page.getByLabel('Account menu');
    }

    async navigateToShorts() {
        await this.guide.click();
        await this.page.getByRole('link', { name: 'Shorts' }).click();
        await (await this.guideClose()).waitFor({ state: 'hidden' });
    }


}