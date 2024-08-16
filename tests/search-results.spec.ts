import { test as base, expect } from '@playwright/test';
import { SearchResultsPage } from './pages/search-results-page';

const test = base.extend<{ searchResultsPage: SearchResultsPage }>({
    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await searchResultsPage.goto();
        await use(searchResultsPage);
    }
});

test('Searching navigates to proper search page', async({ searchResultsPage }) => {
    await searchResultsPage.clickHomeButton(); // Start from the home screen
    await searchResultsPage.searchQuery(searchResultsPage.getSearch());
    let re = await searchResultsPage.regex();
    await expect(searchResultsPage.page).toHaveURL(re);
    await expect(searchResultsPage.page).toHaveTitle(searchResultsPage.getSearch() + ' - YouTube');
});

test('Searching results in clickable videos with thumbnails', async({ searchResultsPage }) => {
    // Wait for Shorts Shelf to load in
    await searchResultsPage.page.locator('ytd-reel-shelf-renderer #contents').nth(0).waitFor({ state: 'visible' });
    // Locate the first few dynamically loaded results
    const searchResultsList = await searchResultsPage.searchResultsList();
    console.log(searchResultsList.length);
    for(const i in searchResultsList) {
        // Assert thumbnail and video link
        await searchResultsList[i].locator('#dismissible a').nth(0).hover();
        await expect(searchResultsList[i].locator('#dismissible a').nth(0)).toHaveId('thumbnail');
        await expect(searchResultsList[i].locator('#dismissible a').nth(0)).toHaveAttribute('href', /(watch\?v=.+$)?(shorts\/.+$)?/);
        await expect(searchResultsList[i].locator('#dismissible a yt-image img').nth(0)).toBeVisible();
    }
});