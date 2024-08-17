import { test as base, expect } from '@playwright/test';
import { ShortsPage } from './pages/shorts-page';

const test = base.extend<{ shortsPage: ShortsPage }>({
    shortsPage: async ({ page }, use) => {
        const shortsPage = new ShortsPage(page);
        await shortsPage.goto();
        await use(shortsPage);
    }
});

test('Clicking like button should prompt sign in', async({ shortsPage }) => {
    await shortsPage.likeButton.click();
    await expect(shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ shortsPage }) => {
    await shortsPage.dislikeButton.click();
    await expect(shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
});

test('Clicking comments button should open the comment section with an X button', async({ shortsPage }) => {
    await shortsPage.commentsButton.click();
    await expect(shortsPage.page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByTitle('Comments')).toBeVisible();
    await shortsPage.page.getByRole('button', { name: 'Close' }).click();
});

test('Clicking share button opens a popup with 12 social media platforms', async({ shortsPage }) => {
    await shortsPage.clickShareButton();
    await expect(shortsPage.page.getByRole('listbox')).toBeVisible();
    const socialsList = await shortsPage.page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(12);
    await shortsPage.page.getByLabel('Cancel').click();
});

test('Clicking more actions button opens a menu', async({ shortsPage }) => {
    await shortsPage.moreActionsButton.click();
    await expect(shortsPage.page.getByText('Description Captions Report Send Feedback')).toBeVisible();
});

test('Next and Previous Buttons Navigate Correctly', async({ shortsPage }) => {
    await shortsPage.page.waitForURL(await shortsPage.regex()); // Waits for page to load
    const firstTitle = await shortsPage.page.title();
    await shortsPage.navigateToNextShort();

    await expect(await shortsPage.getShortsVideo()).toBeVisible();
    const secondTitle = await shortsPage.page.title();
    expect(secondTitle).not.toBe(firstTitle);
    await shortsPage.navigateToPreviousShort();

    await expect(await shortsPage.getShortsVideo()).toBeVisible();
    const currentTitle = await shortsPage.page.title();
    expect(currentTitle).toBe(firstTitle);
    expect(currentTitle).not.toBe(secondTitle);
});

test('Clicking on video toggles pause/play', async({ shortsPage }) => {
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);
    await shortsPage.shortsPlayer.click();
    await expect(shortsPage.shortsPlayer).toHaveClass(/paused-mode/);
    await shortsPage.shortsPlayer.click();
    await expect(shortsPage.shortsPlayer).toHaveClass(/playing-mode/);
});

test('Mute button sets volume to 0%', async({ shortsPage }) => {
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Mute');
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 100%;');
    await shortsPage.volumeButton.click();
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Unmute');
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 0%;');
});