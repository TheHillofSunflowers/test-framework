import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './page';

export class VideoPage extends BasePage {
    private videoLink: string;
    readonly title: Locator;
    readonly channelName: Locator;
    readonly avatar: Locator;
    readonly avatarImage: Locator;
    readonly subscribeButton: Locator;
    readonly likeButton: Locator;
    readonly dislikeButton: Locator;
    readonly shareButton: Locator;
    readonly moreActionsButton: Locator;
    readonly description: Locator;
    readonly commentsCount: Locator;
    readonly relatedVideosContentsWhileWatchingPlaylist: Locator;
    readonly relatedVideosContent: Locator;

    constructor(page: Page) {
        super(page);
        this.videoLink = '/watch?v=bdXPhRj10jQ';
        this.title = page.locator('#primary-inner #title');
        this.channelName = page.locator('#owner #text');
        this.avatar = page.locator('ytd-video-owner-renderer > a');
        this.avatarImage = page.locator('ytd-video-owner-renderer > a img');
        this.subscribeButton = page.locator('#primary-inner #subscribe-button');
        this.likeButton = page.locator('#actions .YtLikeButtonViewModelHost');
        this.dislikeButton = page.locator('#actions .YtDislikeButtonViewModelHost');
        this.shareButton = page.locator('#actions').getByLabel('Share');
        this.moreActionsButton = page.locator('#actions').getByLabel('More actions');
        this.description = page.locator('#description-inner');
        this.commentsCount = page.locator('#comments .count-text span').nth(0);
        this.relatedVideosContentsWhileWatchingPlaylist = page.locator('#related ytd-item-section-renderer > div').filter({ has: page.locator('#contents')});
        this.relatedVideosContent = page.locator('#related #items ytd-compact-video-renderer');
    }

    async getVideoLink(): Promise<string> {
        return this.videoLink;
    }

    async setVideoLink(videoLink: string): Promise<void> {
        this.videoLink = videoLink;
    }

    async goto(URL?: string): Promise<void> {
        await this.page.goto(URL ?? this.videoLink);
        await this.page.waitForURL(await this.regex());
    }

    async regex(): Promise<RegExp> {
        return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/;
    }

    async getChannelName(): Promise<string | null> {
        return this.channelName.getAttribute('text');
    }

    async getChannelLink(): Promise<string | null> {
        return this.channelName.locator('a').getAttribute('href');
    }

    async getAvatarLink(): Promise<string | null> {
        return this.avatar.getAttribute('href');
    }

    async getAvatarImageSource(): Promise<string | null> {
        return this.avatarImage.getAttribute('src');
    }
}