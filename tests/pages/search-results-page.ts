import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class SearchResultsPage extends BasePage {
    private search: string;

    constructor(page: Page, search?: string) {
        super(page);
        this.search = search ?? 'test !@#$%^&*()%\\{}[]'; // Include an extra \ for each \ that you want to search for
    }

    getSearch(): string {
        return this.search;
    }

    setSearch(search: string): void {
        this.search = search;
    }

    async goto() {
        let searchEncode = await this.encodeURIYT(this.search);
        await this.page.goto('https://www.youtube.com/results?search_query=' + searchEncode);
    }

    // Encodes input string to URI Component, including + according to youtube's functionality
    async encodeURIYT(string: string): Promise<string> {
        let searchEncode = encodeURIComponent(string);
        searchEncode = searchEncode.replace(/%20/g, '+');
        return searchEncode;
    }

    // Encodes input string to URI Component and then converts that into regex
    async encodeForRegex(string: string): Promise<string> {
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

    // Encodes string URL into regex and then adds the specified search query to the URL
    async regex(): Promise<RegExp> {
        let searchEncode = await this.encodeForRegex(this.search);
        let regex = new RegExp(`^https?:\/\/(www\\.)?youtube\\.com\/results\\?search_query=${searchEncode}$`) // Needs double slash for the . and ?
        return regex;
    }

    // Returns an array of video search results
    async searchResultsList(): Promise<Array<Locator>> {
        return this.page.locator('#contents ytd-video-renderer').all();
    }
}