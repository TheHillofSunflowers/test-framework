import { test, expect } from '@playwright/test';
import { ShortsPage } from './pages/shorts-page';

test('Shorts Functionality', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    page.setViewportSize({ width: 1960, height: 1080 });
    await shortsPage.likeButton.click();
    await expect(page.locator('tp-yt-iron-dropdown').getByText('Like this video?')).toBeVisible();
    //await page.locator('#shorts-container').click();
    if(await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).isVisible()) {
        await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).click();
    }
    await page.locator('#search-form #container').click();
    
    await shortsPage.dislikeButton.click();
    await expect(page.locator('tp-yt-iron-dropdown').getByText('Don\'t like this video?')).toBeVisible();
    //await page.locator('#shorts-container').click();
    //await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).click();
    await page.locator('#search-form #container').click();

    if(await shortsPage.commentsButton.isVisible()) {
        await shortsPage.commentsButton.click();
        await expect(page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByTitle('Comments')).toBeVisible();
        await page.getByRole('button', { name: 'Close' }).click();
    } else if(await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Disabled', { exact: true }).isVisible()) {
        await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Disabled', { exact: true }).click();
    }
});

test('Shorts Functionality 2', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();

    page.setViewportSize({ width: 1960, height: 1080 });
    await shortsPage.clickShareButton();
    await expect(page.getByRole('listbox')).toBeVisible();
    const socialsList = await page.getByLabel('Select an application to share with').locator('yt-share-target-renderer').all();
    expect(socialsList).toHaveLength(12);
    await page.getByLabel('Cancel').click();

    await shortsPage.moreActionsButton.click();
    await expect(page.getByText('Description Captions Report Send Feedback')).toBeVisible();
});

test('Next Button Navigates Correctly', async({ page }) => {
    const shortsPage = new ShortsPage(page);
    await shortsPage.goto();
    await page.waitForURL(await shortsPage.regex());
    await page.setViewportSize({ width: 1960, height: 1080 });
    //if(await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).isVisible()) {
    //    await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).click();
    //}
    const firstThumbnail = await (await shortsPage.getShortsThumbnail()).getAttribute('style');
    await shortsPage.navigateToNextShort();

    await expect(await shortsPage.getShortsThumbnail()).toHaveAttribute('style', /.+frame0\.jpg/);
    const secondThumbnail = await (await shortsPage.getShortsThumbnail()).getAttribute('style');
    //if(await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).isVisible()) {
    //    await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).click();
    //}
    expect(secondThumbnail).not.toBe(firstThumbnail);

    //if(await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).isVisible()) {
    //    await page.locator(`[id="\\3${shortsPage.shortsIterator}"]`).getByLabel('Play', { exact: true }).click();
    //}
    await expect(page.locator(`[id="\\3${shortsPage.shortsIterator--}"]`).locator('.player-container')).toHaveAttribute('style', /.+frame0\.jpg/);
    const currentThumbnail = await (page.locator(`[id="\\3${shortsPage.shortsIterator--}"]`).locator('.player-container')).getAttribute('style');
    expect(currentThumbnail).toBe(firstThumbnail);
    expect(currentThumbnail).not.toBe(secondThumbnail);
});