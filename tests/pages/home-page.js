// @ts-check
const { expect } = require('@playwright/test');
const { Page } = require('./page');

exports.HomePage = class HomePage extends Page {
    
    constructor(page) {
        super(page);
        this.videoRow = page.locator('ytd-rich-grid-row');
        this.body = page.locator('contents').locator('ytd-rich-grid-renderer');
        this.getStartedTitle = page.getByLabel('Try searching to get started');
        this.getStartedSubtitle = page.getByLabel('Start watching videos to help');
    }

    async goto() {
        await this.page.goto('https://www.youtube.com/');
    }

    async chipsList() {
        return this.page.getByRole('tab').all();
    }
}