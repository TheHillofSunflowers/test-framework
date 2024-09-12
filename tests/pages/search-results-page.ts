import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class SearchResultsPage extends BasePage {
    private search: string;
    readonly filterButton: Locator;

    constructor(page: Page, search?: string) {
        super(page);
        this.search = search ?? 'test !@#$%^&*()%\\{}[]=:;.?|/'; // Include an extra \ for each \ that you want to search for
        this.filterButton = page.locator('#filter-button');
    }

    // Getter for search property
    getSearch(): string {
        return this.search;
    }

    // Setter for search property
    setSearch(search: string): void {
        // Include an extra \ for each \ that you want to search for
        this.search = search;
    }

    // Define overloads
    async goto(): Promise<void>;
    async goto(search: string): Promise<void>;

    // Navigate to appropriate search results page
    async goto(search?: string): Promise<void> {
        console.log('Navigating to search results page...');
        if (search) {
            this.setSearch(search);
        }
        const searchEncode = await SearchResultsPage.encodeURIYT(this.getSearch());
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
    async getVideoSearchResultsList(): Promise<Array<Locator>> {
        return this.page.locator('#contents ytd-video-renderer').all();
    }

    // Returns an array of channel search results
    async getChannelSearchResultsList(): Promise<Array<Locator>> {
        return this.page.locator('#contents ytd-channel-renderer').all();
    }

    async getFilterColumns(): Promise<Array<Locator>> {
        return this.page.locator('tp-yt-paper-dialog ytd-search-filter-options-dialog-renderer #options ytd-search-filter-group-renderer').all();
    }

    async getRowsInFilterColumn(col: Locator): Promise<Array<Locator>> {
        return col.locator('ytd-search-filter-renderer').all();
    }
}