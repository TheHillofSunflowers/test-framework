import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class SearchResultsPage extends BasePage {
    private search: string;

    constructor(page: Page, search?: string) {
        super(page);
        this.search = search ?? 'test !@#$%^&*()%\\{}[]=:;.?|/'; // Include an extra \ for each \ that you want to search for
    }

    getSearch(): string {
        return this.search;
    }

    setSearch(search: string): void {
        this.search = search; // Include an extra \ for each \ that you want to search for
    }

    // Define overloads
    async goto(): Promise<void>;
    async goto(search: string): Promise<void>;

    async goto(search?: string): Promise<void> {
        const searchEncode = await SearchResultsPage.encodeURIYT(search ?? this.getSearch());
        await this.page.goto(`https://www.youtube.com/results?search_query=${searchEncode}`);
    }

    // Encodes input string to URI Component, including + according to youtube's functionality
    static async encodeURIYT(string: string): Promise<string> {
        let searchEncode = encodeURIComponent(string);
        return searchEncode.replace(/%20/g, '+');
    }

    // Encodes input string to URI Component and then converts that into regex
    static async encodeForRegex(string: string): Promise<string> {
        const searchEncode = await SearchResultsPage.encodeURIYT(string);
        return searchEncode.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    }

    // Encodes string URL into regex and then adds the specified search query to the URL
    async getSearchQueryRegex(): Promise<RegExp> {
        const searchEncode = await SearchResultsPage.encodeForRegex(this.getSearch());
        return new RegExp(`^https?:\/\/(www\\.)?youtube\\.com\/results\\?search_query=${searchEncode}$`) // Needs double slash for the . and ?
    }

    // Returns an array of video search results
    async searchResultsList(): Promise<Array<Locator>> {
        return this.page.locator('#contents ytd-video-renderer').all();
    }
}