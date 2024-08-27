import { test as base, expect } from '@playwright/test';
import { VideoPage } from './pages/video-page';

// VideoPage fixture that navigates to a default video player page
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
    // Assert that channel name and channel avatar link to their respective URLs
    expect(await videoPage.getChannelLink()).toBe('/channel/UCKKKYE55BVswHgKihx5YXew');
    expect(await videoPage.getAvatarLink()).toBe('/@porterrobinson');

    // Click channel name
    await videoPage.channelName.click();

    // Assert navigation to channel link
    expect(videoPage.page).toHaveURL('/channel/UCKKKYE55BVswHgKihx5YXew');

    // Navigate to previous page
    await videoPage.page.goBack();

    // Click channel avatar
    await videoPage.avatar.click();

    // Wait for page to load
    await videoPage.page.waitForTimeout(2000);

    // Assert navigation to respective channel link
    expect(videoPage.page).toHaveURL('/@porterrobinson');
});

test('Clicking subscribe button should prompt log in', async({ videoPage }) => {
    // Click subscribe button next to uploader's channel
    await videoPage.subscribeButton.click();

    // Assert sign in prompt is visible
    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Want to subscribe to this channel?')).toBeVisible();

    // Assert sign in button is visible
    await expect(videoPage.page.locator('ytd-modal-with-title-and-button-renderer').getByLabel('Sign in')).toBeVisible();
});

test('Clicking like button should prompt sign in', async({ videoPage }) => {
    // Click like button
    await videoPage.likeButton.click();

    // Assert sign in prompt is visible
    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ videoPage }) => {
    // Click dislike button
    await videoPage.dislikeButton.click();
    
    // Assert sign in prompt is visible
    await expect(videoPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
});

test('Clicking share button opens a popup with 15 media platforms', async({ videoPage }) => {
    // Click share button
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
    // Click more actions button
    await videoPage.moreActionsButton.click();

    // Assert one menu item pops up
    await expect(videoPage.page.getByRole('menuitem')).toHaveCount(1);

    // Assert Report menu item is visible
    await expect(videoPage.page.getByText('Report')).toBeVisible();
});

test('Assert video description', async({ videoPage }) => {
    // Assert description is visible
    await expect(videoPage.description).toBeVisible();

    // Assert description messages are visible
    await expect(videoPage.description).toHaveText(/Porter Robinson - Hollowheart ft. Amy Millan \(From the Worlds 10th Anniversary Edition\)/);

    await expect(videoPage.description).toHaveText(/WORLDS 10th Anniversary Edition ft. Hollowheart \+\+ AND!! \+\+ Worlds Live, printed to Vinyl for the first time ever!/);

    // Extend description by clicking
    await videoPage.description.click();

    // Assert hidden description message is visible
    await expect(videoPage.description).toHaveText(/happy 10th anniversary to an album that changed my life forever【=◈︿◈=】/);
});

test('Comment section will display an accurate count of comments', async({ videoPage }) => {
    // Wait for page to load
    await videoPage.page.waitForTimeout(1000);

    // Scroll down
    await videoPage.page.mouse.wheel(0, 500);

    // Convert commas from number and use unary operator to convert to an int
    const stringCount = await videoPage.commentsCount.innerText();
    const commalessCount = stringCount.replace(/,/g, '');
    const count = +commalessCount;
    
    // Assert that the amount of comments at least excels a previously manually checked number
    expect(count).toBeGreaterThanOrEqual(2776);
});

test('Assert related videos details', async({ videoPage }) => {
    // Locate all related videos in the sidebar
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