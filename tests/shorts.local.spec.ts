import { test, expect } from '@playwright/test';
import { ShortsPage } from './pages/shorts-page';

test('like button opens a sign in prompt', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    await shortsPage.likeButton.click();
    await expect(page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
});

test('dislike button opens a sign in prompt', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    await shortsPage.dislikeButton.click();
    await expect(page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
});

test('comments button opens the comment section with an X button', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    await shortsPage.commentsButton.click();
    await expect(page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByTitle('Comments')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
});

test('share button opens a popup with 12 social media platforms', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    await shortsPage.clickShareButton();
    await expect(page.getByRole('listbox')).toBeVisible();
    const socialsList = await page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(12);
    await page.getByLabel('Cancel').click();
});

test('more actions button opens a menu', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    await shortsPage.moreActionsButton.click();
    await expect(page.getByText('Description Captions Report Send Feedback')).toBeVisible();
});

test('Next and Previous Buttons Navigate Correctly', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();
    await page.waitForURL(await shortsPage.regex()); // Waits for page to load
    const firstTitle = await page.title();
    await shortsPage.navigateToNextShort();

    await expect(await shortsPage.getShortsVideo()).toBeVisible();
    const secondTitle = await page.title();
    expect(secondTitle).not.toBe(firstTitle);
    await shortsPage.navigateToPreviousShort();

    await expect(await shortsPage.getShortsVideo()).toBeVisible();
    const currentTitle = await page.title();
    expect(currentTitle).toBe(firstTitle);
    expect(currentTitle).not.toBe(secondTitle);
});

test('Clicking on video pauses', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);
    await shortsPage.shortsPlayer.click();
    await expect(shortsPage.shortsPlayer).toHaveClass(/paused-mode/);
    await shortsPage.shortsPlayer.click();
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);
});

test('Mute button sets volume to 0%', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Mute');
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 100%;');
    await shortsPage.volumeButton.click();
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Unmute');
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 0%;');
});