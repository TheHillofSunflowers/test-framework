import { type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;
    readonly homeButton: Locator;
    readonly guide: Locator;
    readonly searchButton: Locator;
    readonly voiceButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeButton = page.locator('#start').getByRole('link', { name: 'YouTube Home' });
        this.guide = page.locator('#start').getByLabel('Guide');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
        this.voiceButton = page.getByLabel('Search with your voice');
    }

    // Clicks YouTube logo home button
    async clickHomeButton(): Promise<void> {
        console.log('Clicking home button...')
        await this.homeButton.click();
    }

    // Opens hamburger guide menu
    async openGuideMenu(): Promise<void> {
        console.log('Opening guide menu...')
        await this.guide.click();
    }

    async getGuideCloseButton(): Promise<Locator> {
        return this.page.locator('#guide-content #button');
    }

    // Click search button
    async submitSearch(): Promise<void> {
        console.log('Clicking search button thrice...')
        await this.searchButton.click();
        await this.searchButton.click();
        await this.searchButton.click(); // Three separate clicks for it to go through
    }

    // Input string into search bar and submit
    async searchQuery(input: string): Promise<void> {
        console.log(`Searching for ${input} ...`);
        await this.page.getByPlaceholder('Search').fill(input);
        await this.submitSearch();
    }

    // Clicks search with voice button
    async clickVoiceButton(): Promise<void> {
        console.log('Clicking voice button...');
        await this.voiceButton.click();
    }

    async getLoginButton(): Promise<Locator> {
        return this.page.getByLabel('Sign in');
    }

    async getAccountMenu(): Promise<Locator> {
        return this.page.getByLabel('Account menu');
    }

    // Opens guide menu and clicks indicated button
    async navigateToGuideItem(page: 'Home' | 'Shorts' | 'Subscriptions' | 'You' | 'History'): Promise<void> {
        console.log(`Navigating to ${page}...`);
        await this.openGuideMenu();
        await this.page.locator('#sections').getByTitle(`${page}`, { exact: true }).click(); // On firefox/webkit, 'Home' will not close the guide
        await this.page.waitForTimeout(2000);
    }
}