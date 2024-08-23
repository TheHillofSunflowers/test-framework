import { test as base, expect } from '@playwright/test';
import { ShortsPage } from './pages/shorts-page';

// ShortsPage fixture that navigates to the Shorts page
const test = base.extend<{ shortsPage: ShortsPage }>({
    shortsPage: async ({ page }, use) => {
        const shortsPage = new ShortsPage(page);
        await shortsPage.goto();
        await use(shortsPage);
    }
});

test('Clicking like button should prompt sign in', async({ shortsPage }) => {
    // Click like button
    await shortsPage.likeButton.click();

    // Assert sign in prompt
    await expect(shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
});

test('Clicking dislike button should prompt sign in', async({ shortsPage }) => {
    // Click dislike button
    await shortsPage.dislikeButton.click();

    // Assert sign in prompt
    await expect(shortsPage.page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
});

test('Clicking comments button should open the comment section with an X button', async({ shortsPage }) => {
    // Click comments button
    await shortsPage.commentsButton.click();

    // Assert comments section is visible
    await expect(shortsPage.page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByTitle('Comments')).toBeVisible();

    // Close comments section
    await shortsPage.page.getByRole('button', { name: 'Close' }).click();
});

test('Clicking share button opens a popup with 12 social media platforms', async({ shortsPage }) => {
    // Click share button
    await shortsPage.clickShareButton();

    // Assert popup menu is visible
    await expect(shortsPage.page.getByRole('listbox')).toBeVisible();

    // Assert 12 social media links are visible
    const socialsList = await shortsPage.page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(12);

    // Close menu
    await shortsPage.page.getByLabel('Cancel').click();
});

test('Clicking more actions button opens a menu', async({ shortsPage }) => {
    // Click more actions button
    await shortsPage.moreActionsButton.click();

    // Assert that options menu shows up
    await expect(shortsPage.page.getByText('Description Captions Report Send Feedback')).toBeVisible();
});

test('Next and Previous Buttons Navigate Correctly', async({ shortsPage }) => {
    // Wait for page to navigate
    //await shortsPage.page.waitForURL(await shortsPage.regex());

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
    await shortsPage.shortsPlayer.click();

    // Assert shorts has paused
    await expect(shortsPage.shortsPlayer).toHaveClass(/paused-mode/);

    // Click shorts video
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
    await shortsPage.volumeButton.click();

    // Assert unmute button
    await expect(shortsPage.volumeButton).toHaveAttribute('title', 'Unmute');

    // Assert volume is muted
    await expect(shortsPage.volume).toHaveAttribute('style', '--gradient-percent: 0%;');
});