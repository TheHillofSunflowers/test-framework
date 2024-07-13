// @ts-check
const { expect } = require('@playwright/test');
const { Page } = require('./page');

exports.SearchResultsPage = class SearchResultsPage extends Page {
    constructor(page) {
        super(page);
        this.search = 'test';
    }

    async goto() {
        await this.page.goto('https://www.youtube.com/results?search_query=' + this.search);
    }

    async regex() {
        let regex = new RegExp(`^https?:\/\/(www\\.)?youtube\\.com\/results\\?search_query=${this.search}`) // Needs double slash for the . and y
        console.log(regex);
        return regex;
    }

    async searchResultsList() {
        return this.page.locator('ytd-item-section-renderer div ytd-video-renderer').locator('#ytd-item-section-renderer').all();
    }

    async searchQuery() {
        await this.page.getByPlaceholder('Search').fill(this.search);
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
        await this.page.getByRole('button', { name: 'Search', exact: true }).click(); // Two separate clicks for it to go through
    }
}