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

    async clickHomeButton() {
        await this.homeButton.click();
    }

    async openGuideMenu() {
        await this.guide.click();
    }

    async guideCloseButton(): Promise<Locator> {
        return this.page.locator('#guide-content #button');
    }

    async inputSearch() {
        await this.searchButton.click();
        await this.searchButton.click();
        await this.searchButton.click(); // Three separate clicks for it to go through
    }

    async searchQuery(input: string) {
        await this.page.getByPlaceholder('Search').fill(input);
        await this.inputSearch();
    }

    async clickVoiceButton() {
        await this.voiceButton.click();
    }

    async loginButton(): Promise<Locator> {
        return this.page.getByLabel('Sign in');
    }

    async accountMenu(): Promise<Locator> {
        return this.page.getByLabel('Account menu');
    }

    async navigateToShorts() {
        await this.guide.click();
        await this.page.getByRole('link', { name: 'Shorts' }).click();
        await (await this.guideCloseButton()).waitFor({ state: 'hidden' });
    }


}