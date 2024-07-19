// @ts-check
const { expect } = require('@playwright/test');
//require('dotenv').config();

exports.Page = class Page {
    constructor(page) {
        this.page = page;
        this.homeButton = page.locator('#start').getByRole('link', { name: 'YouTube Home' });
        this.guide = page.locator('#start').getByLabel('Guide');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
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
}