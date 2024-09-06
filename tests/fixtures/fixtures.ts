import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { ShortsPage } from '../pages/shorts-page';
import { VideoPage } from '../pages/video-page';
import { SearchResultsPage } from '../pages/search-results-page';

// Define Typing for Fixtures
type MyFixtures = {
    homePage: HomePage;
    shortsPage: ShortsPage;
    videoPage: VideoPage;
    searchResultsPage: SearchResultsPage;
};

// Extend test to contain all our fixtures, which can be deconstructed in the respective test
export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    
    shortsPage: async ({ page }, use) => {
        const shortsPage = new ShortsPage(page);
        await use(shortsPage);
    },

    videoPage: async({ page }, use) => {
        const videoPage = new VideoPage(page);
        await use(videoPage);
    },

    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },
});

export { expect } from '@playwright/test';