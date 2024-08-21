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

    async clickHomeButton(): Promise<void> {
        await this.homeButton.click();
    }

    async openGuideMenu(): Promise<void> {
        await this.guide.click();
    }

    async getGuideCloseButton(): Promise<Locator> {
        return this.page.locator('#guide-content #button');
    }

    async submitSearch(): Promise<void> {
        await this.searchButton.click();
        await this.searchButton.click();
        await this.searchButton.click(); // Three separate clicks for it to go through
    }

    async searchQuery(input: string): Promise<void> {
        await this.page.getByPlaceholder('Search').fill(input);
        await this.submitSearch();
    }

    async clickVoiceButton(): Promise<void> {
        await this.voiceButton.click();
    }

    async getLoginButton(): Promise<Locator> {
        return this.page.getByLabel('Sign in');
    }

    async getAccountMenu(): Promise<Locator> {
        return this.page.getByLabel('Account menu');
    }

    async navigateToGuideItem(page: 'Home' | 'Shorts' | 'Subscriptions' | 'You' | 'History'): Promise<void> {
        await this.openGuideMenu();
        await this.page.locator('tp-yt-paper-item').filter({ hasText: `${page}` }).click();
        await (await this.getGuideCloseButton()).waitFor({ state: 'hidden' });
    }
}