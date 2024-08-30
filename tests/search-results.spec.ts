import { test as base, expect } from '@playwright/test';
import { SearchResultsPage } from './pages/search-results-page';

// SearchResultsPage fixture that navigates to the Search Results page
const test = base.extend<{ searchResultsPage: SearchResultsPage }>({
    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await searchResultsPage.goto();
        await use(searchResultsPage);
    }
});

test('Navigate to proper search page after searching', async({ searchResultsPage }) => {
    // Navigate to home page
    await searchResultsPage.clickHomeButton();

    // Submit search
    await searchResultsPage.searchQuery(searchResultsPage.getSearch());

    // Assert URL navigated to appropriate search page
    let searchRegex = await searchResultsPage.getSearchQueryRegex();
    await expect(searchResultsPage.page).toHaveURL(searchRegex);

    // Assert appropriate search results page title
    await expect(searchResultsPage.page).toHaveTitle(searchResultsPage.getSearch() + ' - YouTube');
});

test('Search results contain clickable videos with thumbnails', async({ searchResultsPage }) => {
    // Use the home button as an indicator for the page being loaded
    await searchResultsPage.homeButton.waitFor({ state: 'visible' });

    // Locate the first few dynamically loaded results
    const searchResultsList = await searchResultsPage.getVideoSearchResultsList();
    console.log(searchResultsList.length);
    expect(searchResultsList.length).toBeGreaterThan(0);

    // Loop through located results
    for(const result of searchResultsList) {
        // Locate thumbnail
        const thumbnail = result.locator('#dismissible a').nth(0);
        await thumbnail.hover();
        await expect(thumbnail).toHaveId('thumbnail');

        // Assert thumbnail links to a video
        await expect(thumbnail).toHaveAttribute('href', /(watch\?v=.+$)?(shorts\/.+$)?/);

        // Assert thumbnail visibility
        await expect(thumbnail.locator('yt-image img')).toBeVisible();
    }
});

test('Can filter results through chips list', async({ searchResultsPage }) => {
    // Get list of chips
    const chipsList = searchResultsPage.page.getByRole('tablist');

    // Wait for visibility of chips
    await searchResultsPage.page.waitForTimeout(5000);

    // Assert chips list is visible
    await chipsList.isVisible();
    await chipsList.getByText('All').isVisible();

    // Get array of all chips
    const chips = await searchResultsPage.page.locator('#chips yt-chip-cloud-chip-renderer').all();

    let firstPass = false;

    // Take screenshot of original search results
    const beforeFilter = await searchResultsPage.page.screenshot({ path: `filter${0}.png` });

    // Iterate through each chip
    for (let i = 0; i < chips.length; i++) {
        // Apply filter
        await chips[i].click();

        // Assert filter is selected
        await expect(chips[i]).toHaveClass('iron-selected');
        await expect(chips[i]).toHaveJSProperty('aria-selected', true);

        // After every filter is applied:
        if (firstPass) {
            // Take screenshot
            let filtered = await searchResultsPage.page.locator('#container ytd-item-section-renderer').screenshot({ path: `filter${i}.png`});

            // Assert that filter has changed results from the original search results
            expect(filtered).not.toMatchSnapshot({name: `filter${i--}.png`});
        }

        // Indicate that we are now moving away from the default filter
        firstPass = true;
    }
});

test('Can filter search results', async({ searchResultsPage }) => {
    // Open filter menu
    await searchResultsPage.filterButton.isVisible();
    await searchResultsPage.filterButton.click();

    // Assert filters are visible
    await expect(searchResultsPage.page.locator('yt-formatted-string').filter({ hasText: 'Search filters' })).toBeVisible();

    // Declare variables for the filter table
    const columns = await searchResultsPage.getFilterColumns();
    const sortByColumn = columns[4];
    const sortByRows = await searchResultsPage.getRowsInFilterColumn(sortByColumn);

    // Get Relevance filter
    const relevanceFilter = sortByRows[0];

    // Assert that Relevance filter is selected by default
    await expect(relevanceFilter).toHaveClass(/selected/);

    // Get Live filter
    const featuresColumn = columns[3];
    const featuresRows = await searchResultsPage.getRowsInFilterColumn(featuresColumn);
    const liveFilter = featuresRows[0];

    // Apply Live filter
    await liveFilter.locator('a').click();
    await searchResultsPage.page.waitForTimeout(2000);

    // Assert URL change due to filtering
    await expect(searchResultsPage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/results\?search_query=.+&sp=.+$/);

    // Assert visibility of Live badges on the filtered results
    const liveBadges = await searchResultsPage.page.getByLabel('LIVE', { exact: true }).all();
    for (let i = 0; i < liveBadges.length; i++) {
        await expect(liveBadges[i]).toBeVisible();
    }

    // Apply filter
    await searchResultsPage.filterButton.click();

    // Assert filter is selected
    await expect(liveFilter).toHaveClass(/selected/);

    // Dismiss filter
    await searchResultsPage.page.getByTitle('Remove Live filter').click();
    await searchResultsPage.page.waitForTimeout(2000);

    // Open filter menu
    await searchResultsPage.filterButton.click();

    // Assert filter is no longer selected
    await expect(liveFilter).not.toHaveClass(/selected/);
});