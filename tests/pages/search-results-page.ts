import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class SearchResultsPage extends BasePage {
    readonly search: string;

    constructor(page: Page) {
        super(page);
        this.search = 'test !@#$%^&*()%\\{}[]'; // Include an extra \ for each \ that you want to search for
    }

    async goto() {
        let searchEncode = await this.encodeURIYT(this.search);
        await this.page.goto('https://www.youtube.com/results?search_query=' + searchEncode);
    }

    async encodeURIYT(string) {
        let searchEncode = encodeURIComponent(string);
        searchEncode = searchEncode.replace(/%20/g, '+');
        //searchEncode = searchEncode.replace(/%5E/g, '^');
        return searchEncode;
    }

    async encodeForRegex(string) {
        let searchEncode = await this.encodeURIYT(string);
        searchEncode = searchEncode.replace(/\+/g, '\\+');
        searchEncode = searchEncode.replace(/\./g, '\\.');
        searchEncode = searchEncode.replace(/\%/g, '\\%');
        searchEncode = searchEncode.replace(/\-/g, '\\-');
        searchEncode = searchEncode.replace(/\*/g, '\\*');
        searchEncode = searchEncode.replace(/\(/g, '\\(');
        searchEncode = searchEncode.replace(/\)/g, '\\)');
        searchEncode = searchEncode.replace(/\[/g, '\\[');
        searchEncode = searchEncode.replace(/\]/g, '\\]');
        searchEncode = searchEncode.replace(/\{/g, '\\{');
        searchEncode = searchEncode.replace(/\}/g, '\\}');
        searchEncode = searchEncode.replace(/\\/g, '\\');
        return searchEncode;
    }

    async regex() {
        let searchEncode = await this.encodeForRegex(this.search);
        let regex = new RegExp(`^https?:\/\/(www\\.)?youtube\\.com\/results\\?search_query=${searchEncode}$`) // Needs double slash for the . and ?
        return regex;
    }

    async searchQuery() {
        await this.page.getByPlaceholder('Search').fill(this.search);
        await this.searchButton.click();
        await this.searchButton.click();
        await this.searchButton.click(); // Three separate clicks for it to go through
    }

    async searchResultsList() {
        return this.page.locator('#contents ytd-video-renderer').all();
    }
}