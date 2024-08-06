import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class SearchResultsPage extends BasePage {
    search: string;

    constructor(page: Page, search?: string) {
        super(page);
        this.search = search ?? 'test !@#$%^&*()%\\{}[]'; // Include an extra \ for each \ that you want to search for
    }

    setSearch(search: string): void {
        this.search = search;
    }

    async goto() {
        let searchEncode = await this.encodeURIYT(this.search);
        await this.page.goto('https://www.youtube.com/results?search_query=' + searchEncode);
    }

    async encodeURIYT(string: string): Promise<string> {
        let searchEncode = encodeURIComponent(string);
        searchEncode = searchEncode.replace(/%20/g, '+');
        //searchEncode = searchEncode.replace(/%5E/g, '^');
        return searchEncode;
    }

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

    async regex(): Promise<RegExp> {
        let searchEncode = await this.encodeForRegex(this.search);
        let regex = new RegExp(`^https?:\/\/(www\\.)?youtube\\.com\/results\\?search_query=${searchEncode}$`) // Needs double slash for the . and ?
        return regex;
    }

    async searchResultsList(): Promise<Array<Locator>> {
        return this.page.locator('#contents ytd-video-renderer').all();
    }
}