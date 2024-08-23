import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class HomePage extends BasePage {
    readonly videoRow: Locator;
    readonly body: Locator;
    readonly getStartedTitle: Locator;
    readonly getStartedSubtitle: Locator;
    readonly retryConnectionButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.videoRow = page.locator('ytd-rich-grid-row');
        this.body = page.locator('contents').locator('ytd-rich-grid-renderer');
        this.getStartedTitle = page.getByLabel('Try searching to get started');
        this.getStartedSubtitle = page.getByLabel('Start watching videos to help');
        this.retryConnectionButton = page.getByLabel('Retry');
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async regex(): Promise<RegExp> {
        return /^https?:\/\/(www\.)?youtube\.com\/?/;
    }

    // Return list of all filter option chips
    async chipsList(): Promise<Array<Locator>> {
        return this.page.getByRole('tab').all();
    }
}