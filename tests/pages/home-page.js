// @ts-check
const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {

    constructor(page) {
        this.page = page;
        this.videoRow = page.locator('ytd-rich-grid-row');
        this.body = page.locator('contents').locator('ytd-rich-grid-renderer');
        this.chipsList = page.locator('chips').getByRole('tablist');
        this.getStartedTitle = page.getByLabel('Try searching to get started');
        this.getStartedSubtitle = page.getByLabel('Start watching videos to help');
    }

    async goto() {
        await this.page.goto('https://www.youtube.com/');
    }

    /*get btnHome() {
        return $('#start');
    }*/

}