import { test as base, expect } from '@playwright/test';
import { SearchResultsPage } from './pages/search-results-page';

const test = base.extend<{ searchResultsPage: SearchResultsPage }>({
    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await searchResultsPage.goto();
        await use(searchResultsPage);
    }
});

test('Navigate to proper search page after searching', async({ searchResultsPage }) => {
    await searchResultsPage.clickHomeButton(); // Start from the home screen
    await searchResultsPage.searchQuery(searchResultsPage.getSearch());
    let searchRegex = await searchResultsPage.getSearchQueryRegex();
    await expect(searchResultsPage.page).toHaveURL(searchRegex);
    await expect(searchResultsPage.page).toHaveTitle(searchResultsPage.getSearch() + ' - YouTube');
});

test('Search results contain clickable videos with thumbnails', async({ searchResultsPage }) => {
    // Use the home button as an indicator for the page being loaded
    await searchResultsPage.homeButton.waitFor({ state: 'visible' });
    // Locate the first few dynamically loaded results
    const searchResultsList = await searchResultsPage.searchResultsList();
    console.log(searchResultsList.length);
    expect(searchResultsList.length).toBeGreaterThan(0);
    for(const result of searchResultsList) {
        // Assert thumbnail and video link
        const thumbnail = result.locator('#dismissible a').nth(0);
        await thumbnail.hover();
        await expect(thumbnail).toHaveId('thumbnail');
        await expect(thumbnail).toHaveAttribute('href', /(watch\?v=.+$)?(shorts\/.+$)?/);
        await expect(thumbnail.locator('yt-image img')).toBeVisible();
    }
});