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
    readonly playButton: Locator;
    readonly settingsButton: Locator;
    readonly nextButton: Locator;
    readonly fullscreenButton: Locator;
    readonly volumeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.videoLink = '/watch?v=bdXPhRj10jQ';
        this.title = page.locator('#primary-inner #title').nth(0);
        this.channelName = page.locator('#owner #text');
        this.avatar = page.locator('ytd-video-owner-renderer > a');
        this.avatarImage = page.locator('ytd-video-owner-renderer > a img');
        this.subscribeButton = page.locator('#owner #subscribe-button');
        this.likeButton = page.locator('#actions .YtLikeButtonViewModelHost');
        this.dislikeButton = page.locator('#actions .YtDislikeButtonViewModelHost');
        this.shareButton = page.locator('#actions').getByLabel('Share');
        this.moreActionsButton = page.getByRole('button', { name: 'More actions' });
        this.description = page.locator('#below #description-inner');
        this.commentsCount = page.locator('#comments .count-text span').nth(0);
        this.relatedVideosContentsWhileWatchingPlaylist = page.locator('#related ytd-item-section-renderer > div').filter({ has: page.locator('#contents')});
        this.relatedVideosContent = page.locator('#related #items ytd-compact-video-renderer');
        this.playButton = page.locator('.ytp-play-button');
        this.settingsButton = page.locator('#player').locator('[aria-label="Settings"]');
        this.nextButton = page.locator('.ytp-next-button');
        this.fullscreenButton = page.locator('.ytp-fullscreen-button');
        this.volumeButton = page.locator('.ytp-mute-button');
    }

    // Getter for video link property
    getVideoLink(): string {
        return this.videoLink;
    }

    // Setter for video link property
    setVideoLink(videoLink: string): void {
        this.videoLink = videoLink;
    }

    // Define overloads
    async goto(): Promise<void>;
    async goto(URL: string): Promise<void>;

    // Navigate to appropriate video page
    async goto(URL?: string): Promise<void> {
        console.log('Navigating to specific video page...');
        await this.page.goto(URL ?? this.videoLink);
        console.log('Waiting for video page to load...');
        await this.page.waitForURL(await this.regex());
    }

    // Get RegExp for VideoPage URL
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