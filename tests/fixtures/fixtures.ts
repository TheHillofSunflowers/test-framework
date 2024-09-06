import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ShortsPage } from '../pages/shorts-page';
import { VideoPage } from '../pages/video-page';
import { SearchResultsPage } from '../pages/search-results-page';

// Generic function that creates our page objects within our extended test
const createFixture = <T>(PageObject: { new (page: Page): T }) => async (
    { page }: { page: Page },
    use: (Fixture: T) => Promise<void>
) => {
    const pageObject = new PageObject(page);
    await use(pageObject);
};

// Define Typing for Fixtures
type MyFixtures = {
    homePage: HomePage;
    shortsPage: ShortsPage;
    videoPage: VideoPage;
    searchResultsPage: SearchResultsPage;
};

// Extend test to contain all our fixtures, which can be deconstructed in the respective test
export const test = base.extend<MyFixtures>({
    homePage: createFixture(HomePage),
    shortsPage: createFixture(ShortsPage),
    videoPage: createFixture(VideoPage),
    searchResultsPage: createFixture(SearchResultsPage),
});