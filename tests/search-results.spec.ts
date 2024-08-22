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

test('Can filter results through chips list', async({ searchResultsPage }) => {
    const chipsList = searchResultsPage.page.getByRole('tablist');
    await searchResultsPage.page.waitForTimeout(5000);
    await chipsList.isVisible();
    await chipsList.getByText('All').isVisible();
    const chips = await searchResultsPage.page.locator('#chips yt-chip-cloud-chip-renderer').all();
    let firstPass = false;
    const beforeFilter = await searchResultsPage.page.screenshot({ path: `filter${0}.png` });
    for (let i = 0; i < chips.length; i++) {
        await chips[i].click();
        await expect(chips[i]).toHaveClass('iron-selected');
        await expect(chips[i]).toHaveJSProperty('aria-selected', true);
        if (firstPass) {
            let filtered = await searchResultsPage.page.locator('#container ytd-item-section-renderer').screenshot({ path: `filter${i}.png`});
            expect(filtered).not.toMatchSnapshot({name: `filter${i--}.png`});
        }
        firstPass = true;
    }
});

test('Can filter search results', async({ searchResultsPage }) => {
    // Open filter menu
    await searchResultsPage.filterButton.isVisible();
    await searchResultsPage.filterButton.click();
    await expect(searchResultsPage.page.locator('yt-formatted-string').filter({ hasText: 'Search filters' })).toBeVisible();

    // Declare variables for the filter table
    const columns = await searchResultsPage.getFilterColumns();
    const sortByColumn = columns[4];
    const sortByRows = await searchResultsPage.getRowsInFilterColumn(sortByColumn);
    const relevanceFilter = sortByRows[0];

    // Assert that Relevance filter is selected by default
    await expect(relevanceFilter).toHaveClass(/selected/);
    const featuresColumn = columns[3];
    const featuresRows = await searchResultsPage.getRowsInFilterColumn(featuresColumn);
    const liveFilter = featuresRows[0];

    // Apply Live filter and assert URL change
    await liveFilter.locator('a').click();
    await searchResultsPage.page.waitForTimeout(2000);
    await expect(searchResultsPage.page).toHaveURL(/^https?:\/\/(www\.)?youtube\.com\/results\?search_query=.+&sp=.+$/);

    // Assert the visibility of Live badges on the filtered results
    const liveBadges = await searchResultsPage.page.getByLabel('LIVE', { exact: true }).all();
    for (let i = 0; i < liveBadges.length; i++) {
        await expect(liveBadges[i]).toBeVisible();
    }

    // Assert that filter is selected
    await searchResultsPage.filterButton.click();
    await expect(liveFilter).toHaveClass(/selected/);

    // Dismiss filter and assert that filter is no longer selected
    await searchResultsPage.page.getByTitle('Remove Live filter').click();
    await searchResultsPage.page.waitForTimeout(2000);
    await searchResultsPage.filterButton.click();
    await expect(liveFilter).not.toHaveClass(/selected/);
});