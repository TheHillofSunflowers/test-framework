import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class ShortsPage extends BasePage {
    readonly likeButton: Locator;
    readonly dislikeButton: Locator;
    readonly commentsButton: Locator;
    readonly moreActionsButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.likeButton = page.locator('#like-button').getByLabel('like this video along with');
        this.dislikeButton = page.locator('#dislike-button').getByLabel('Dislike this video');
        this.commentsButton = page.locator('#comments-button button').nth(0);
        this.moreActionsButton = page.getByRole('button', { name: 'More actions' });
    }

    async goto() {
        await this.page.goto('https://www.youtube.com/shorts/');
    }

    async regex() {
        let regex = /^https?:\/\/(www\.)?youtube\.com\/shorts\/.+$/;
        return regex;
    }
}