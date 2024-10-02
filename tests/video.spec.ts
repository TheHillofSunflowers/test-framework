import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures'
import * as utils from './utils';

const data = utils.loadTestData('tests/data/data.json');

const testVideo = data.video?.[0];
if (!testVideo) {
    throw new Error('No video data found in the provided JSON file');
}

const {
    kind,
    id,
    title,
    channel,
    duration,
    description,
    viewCount,
    commentCount,
} = testVideo;
const channelLink = data.channel[0].channelLink;
const avatarLink = data.channel[0].avatarLink;

test.beforeEach(async ({ videoPage }) => {
    await videoPage.goto();
});

test('Assert video title', async({ videoPage}) => {
    await expect(videoPage.title).toHaveText(title);
});

test('Assert channel uploader', async({ videoPage }) => {
    await expect(videoPage.channelName).toHaveText(channel);
});

test('Assert channel links @flaky', async({ videoPage }) => {
    // Assert that channel name and channel avatar link to their respective URLs
    expect(await videoPage.getChannelLink()).toBe(channelLink);
    expect(await videoPage.getAvatarLink()).toBe(avatarLink);

    // Click channel name
    console.log('Clicking channel name...');
    await videoPage.channelName.click();

    // Assert navigation to channel link
    expect(videoPage.page).toHaveURL(channelLink);

    // Navigate to previous page
    await videoPage.page.goBack();

    // Wait for loading
    await videoPage.page.reload();

    // Click channel avatar
    console.log('Clicking channel avatar...');
    await videoPage.avatar.click();

    // Wait for page to load
    await videoPage.page.waitForURL(/@/);

    // Assert navigation to respective channel link (Flaky)
    expect(videoPage.page).toHaveURL(avatarLink);
});

test('Clicking subscribe button should prompt log in', async({ videoPage }) => {
    // Click subscribe button next to uploader's channel
    console.log('Clicking subscribe button...');
    await videoPage.subscribeButton.click();

    // Assert sign in prompt is visible
    const signInPrompt = videoPage.page.locator('tp-yt-iron-dropdown').getByText('Want to subscribe to this channel?');
    await expect(signInPrompt).toBeVisible();

    // Assert sign in button is visible
    const signInButton = videoPage.page.locator('ytd-modal-with-title-and-button-renderer').getByLabel('Sign in');
    await expect(signInButton).toBeVisible();
});

test('Clicking like button should prompt sign in', async({ videoPage }) => {
    // Click like button
    console.log('Clicking like button...');
    await videoPage.likeButton.click();

    // Assert sign in prompt is visible
    const signInPrompt = videoPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?');
    await expect(signInPrompt).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ videoPage }) => {
    // Click dislike button
    console.log('Clicking dislike button...');
    await videoPage.dislikeButton.click();
    
    // Assert sign in prompt is visible
    const signInPrompt = videoPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?');
    await expect(signInPrompt).toBeVisible();
});

test('Clicking share button opens a popup with 15 media platforms', async({ videoPage }) => {
    // Click share button
    console.log('Clicking share button...');
    await videoPage.shareButton.click();

    // Assert popup menu is visible
    const popupMenu = videoPage.page.getByRole('listbox');
    await expect(popupMenu).toBeVisible();

    // Assert 15 media links are visible
    const socialsList = await videoPage.page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(15);

    // Close menu
    console.log('Closing share menu...');
    await videoPage.page.getByLabel('Cancel', { exact: true }).click();
});

test('Clicking more actions button opens a menu', async({ videoPage }) => {
    // Click more actions button
    console.log('Clicking more actions button...');
    await videoPage.moreActionsButton.click();

    // Assert one menu item pops up
    const menuItemLocator = videoPage.page.getByRole('menuitem');
    await expect(menuItemLocator).toHaveCount(1);

    // Assert Report menu item is visible
    const reportButton = menuItemLocator.getByText('Report');
    await expect(reportButton).toBeVisible();
});

test('Assert video description', async({ videoPage }) => {
    // Assert description is visible
    await expect(videoPage.description).toBeVisible();

    // Assert description messages are visible
    await expect(videoPage.description).toContainText('Porter Robinson - Hollowheart ft. Amy Millan (From the Worlds 10th Anniversary Edition)');

    await expect(videoPage.description).toContainText(description);

    // Extend description by clicking
    console.log('Extending description...');
    await videoPage.description.click();

    // Assert hidden description message is visible
    await expect(videoPage.description).toContainText('happy 10th anniversary to an album that changed my life forever【=◈︿◈=】');
});

test('Comment section will display an accurate count of comments', async({ videoPage }) => {
    // Wait for page to load
    await videoPage.page.waitForTimeout(1000);

    // Scroll down
    console.log('Scrolling down 500px...');
    await videoPage.page.mouse.wheel(0, 500);

    // Convert commas from number and use unary operator to convert to an int
    const stringCount = await videoPage.commentsCount.innerText();
    const commalessCount = stringCount.replace(/,/g, '');
    const count = +commalessCount;
    
    // Assert that the amount of comments at least excels a previously manually checked number
    expect(count).toBeGreaterThanOrEqual(commentCount);
});

test('Assert related videos details', async({ videoPage }) => {
    // Locate all related videos in the sidebar
    const relatedVideosList = await videoPage.relatedVideosContent.all();

    // Loop through located results
    for (const video of relatedVideosList) {
        // Locate thumbnail
        const thumbnail = video.locator('#dismissible a').nth(0);
        console.log('Hovering cursor over thumbnail...');
        await thumbnail.hover();
        await expect(thumbnail).toHaveId('thumbnail');

        // Assert thumbnail links to a video
        await expect(thumbnail).toHaveAttribute('href', /(watch\?v=.+$)?(shorts\/.+$)?/);

        // Assert thumbnail visibility
        await expect(thumbnail.locator('yt-image img')).toBeVisible();
    }
});