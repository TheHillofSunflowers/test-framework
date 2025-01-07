import { test as base, expect } from '@playwright/test';
import { test } from './fixtures/fixtures'

test.beforeEach(async ({ shortsPage }) => {
    await shortsPage.goto();
});

test('Clicking like button should prompt sign in', async({ shortsPage }) => {
    // Click like button
    await shortsPage.likeButton.click();

    // Assert sign in prompt
    const signInPrompt = shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?');
    await expect(signInPrompt).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ shortsPage }) => {
    // Click dislike button
    console.log('Clicking dislike button...');
    await shortsPage.dislikeButton.click();

    // Assert sign in prompt
    const signInPrompt = shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?');
    await expect(signInPrompt).toBeVisible();
});

test('Clicking comments button should open the comment section with an X button', async({ shortsPage }) => {
    // Click comments button
    console.log('Clicking comments button...');
    await shortsPage.commentsButton.click();

    // Assert comments section is visible
    const commentsTitle = shortsPage.page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByTitle('Comments');
    await expect(commentsTitle).toBeVisible();

    // Close comments section
    console.log('Closing comments section...');
    await shortsPage.page.getByRole('button', { name: 'Close' }).click();
});

test('Clicking share button opens a popup with 12 social media platforms', async({ shortsPage }) => {
    // Click share button
    await shortsPage.clickShareButton();

    // Assert popup menu is visible
    const popupMenu = shortsPage.page.getByRole('listbox');
    await expect(popupMenu).toBeVisible();

    // Assert 12 social media links are visible
    const socialsList = await shortsPage.page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(12);

    // Close menu
    console.log('Closing share menu...');
    await shortsPage.page.locator('#close-button').getByLabel('Cancel').click();
});

test('Clicking more actions button opens a menu', async({ shortsPage }) => {
    // Click more actions button
    await shortsPage.moreActionsButton.click();

    // Assert that options menu shows up
    await expect(shortsPage.page.getByText('Description Captions Report Send Feedback')).toBeVisible();
});

test('Next and Previous Buttons Navigate Correctly', async({ shortsPage }) => {
    // Get first shorts title
    const firstTitle = await shortsPage.page.title();

    // Press next short button
    await shortsPage.navigateToNextShort();

    // Assert second shorts video existence
    await expect(await shortsPage.getShortsVideo()).toBeVisible();

    // Get second shorts title
    const secondTitle = await shortsPage.page.title();

    // Assert title change
    expect(secondTitle).not.toBe(firstTitle);

    // Press previous short button
    await shortsPage.navigateToPreviousShort();

    // Assert current shorts video existence
    await expect(await shortsPage.getShortsVideo()).toBeVisible();

    // Get current shorts title
    const currentTitle = await shortsPage.page.title();

    // Assert current short is the original short and not the second short
    expect(currentTitle).toBe(firstTitle);
    expect(currentTitle).not.toBe(secondTitle);
});

test('Clicking on video toggles pause/play', async({ shortsPage }) => {
    // Assert shorts is playing
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);

    // Click shorts video
    console.log('Pausing shorts video...');
    await shortsPage.shortsPlayer.click();

    // Assert shorts has paused
    await expect(shortsPage.shortsPlayer).toHaveClass(/paused-mode/);

    // Click shorts video
    console.log('Playing shorts video...');
    await shortsPage.shortsPlayer.click();

    // Assert shorts is playing again
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);
});

test('Mute button sets volume to 0%', async({ shortsPage }) => {
    // Assert mute button existence
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Mute');

    // Assert volume is on max
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 100%;');

    // Click mute button
    console.log('Clicking mute button...');
    await shortsPage.volumeButton.click();

    // Assert unmute button
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Unmute');

    // Assert volume is muted
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 0%;');
});