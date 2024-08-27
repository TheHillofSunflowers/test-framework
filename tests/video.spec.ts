import { test as base, expect } from '@playwright/test';
import { VideoPage } from './pages/video-page';

const test = base.extend<{ videoPage: VideoPage }>({
    videoPage: async({ page }, use) => {
        const videoPage = new VideoPage(page);
        await videoPage.goto();
        await use(videoPage);
    }
});

test('Assert video title', async({ videoPage}) => {
    await expect(videoPage.title).toHaveText('Porter Robinson - Hollowheart ft. Amy Millan (Worlds 10th Anniversary Edition)');
});

test('Assert channel uploader', async({ videoPage }) => {
    await expect(videoPage.channelName).toHaveText('Porter Robinson');
});

test('Assert channel links', async({ videoPage }) => {
    expect(await videoPage.getChannelLink()).toBe('/channel/UCKKKYE55BVswHgKihx5YXew');
    expect(await videoPage.getAvatarLink()).toBe('/@porterrobinson');

    await videoPage.channelName.click();
    expect(videoPage.page).toHaveURL('/channel/UCKKKYE55BVswHgKihx5YXew');

    await videoPage.page.goBack();
    await videoPage.avatar.click();
    expect(videoPage.page).toHaveURL('/@porterrobinson');
});

test('Clicking subscribe button should prompt log in', async({ videoPage }) => {
    await videoPage.subscribeButton.click();

    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Want to subscribe to this channel?')).toBeVisible();

    await expect(videoPage.page.locator('a').getByText('Sign in')).toBeVisible();
});

test('Clicking like button should prompt sign in', async({ videoPage }) => {
    await videoPage.likeButton.click();

    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ videoPage }) => {
    await videoPage.dislikeButton.click();
    
    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
});

test('Clicking share button opens a popup with 15 media platforms', async({ videoPage }) => {
    await videoPage.shareButton.click();

    // Assert popup menu is visible
    await expect(videoPage.page.getByRole('listbox')).toBeVisible();

    // Assert 15 media links are visible
    const socialsList = await videoPage.page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(15);

    // Close menu
    await videoPage.page.getByLabel('Cancel').click();
});

test('Clicking more actions button opens a menu', async({ videoPage }) => {
    await videoPage.moreActionsButton.click();

    await expect(videoPage.page.getByRole('menuitem')).toHaveCount(2);

    await expect(videoPage.page.getByText('Save Report')).toBeVisible();
});

test('Assert video description', async({ videoPage }) => {
    await expect(videoPage.description).toBeVisible();

    await expect(videoPage.description).toHaveText(/Porter Robinson - Hollowheart ft. Amy Millan (From the Worlds 10th Anniversary Edition)/);

    await expect(videoPage.description).toHaveText(/WORLDS 10th Anniversary Edition ft. Hollowheart \+\+ AND!! \+\+ Worlds Live, printed to Vinyl for the first time ever!/);

    await expect(videoPage.description).toHaveText(/happy 10th anniversary to an album that changed my life forever【=◈︿◈=】/);
});

test('Comment section will display an accurate count of comments', async({ videoPage }) => {
    await videoPage.commentsCount.scrollIntoViewIfNeeded();

    const stringCount = await videoPage.commentsCount.innerText();

    const commalessCount = stringCount.replace(/,/g, '');

    const count = +commalessCount;
    
    expect(count).toBeGreaterThanOrEqual(2776);
});

test('Assert related videos details', async({ videoPage }) => {
    const relatedVideosList = await videoPage.relatedVideosContent.all();

    // Loop through located results
    for (const video of relatedVideosList) {
        // Locate thumbnail
        const thumbnail = video.locator('#dismissible a').nth(0);
        await thumbnail.hover();
        await expect(thumbnail).toHaveId('thumbnail');

        // Assert thumbnail links to a video
        await expect(thumbnail).toHaveAttribute('href', /(watch\?v=.+$)?(shorts\/.+$)?/);

        // Assert thumbnail visibility
        await expect(thumbnail.locator('yt-image img')).toBeVisible();
    }
});