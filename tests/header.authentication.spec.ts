import { test as base, expect } from '@playwright/test';
import { test } from './fixtures/fixtures'
import fs from 'fs';

test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
});

test.beforeEach(async({ page }) => {
    // Load the saved cookies and local storage
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    const localStorage = JSON.parse(fs.readFileSync('localStorage.json', 'utf8'));
  
    await page.context().addCookies(cookies);
    await page.goto('/');
  
    // Load local storage
    await page.evaluate((storage) => {
      for (const [key, value] of Object.entries(storage)) {
        window.localStorage.setItem(key, value as string);
      }
    }, localStorage);
  
    // Navigate to ensure the session is recognized
    await page.reload();
  });
  
  test('Assert Signed In State', async({ homePage }) => {
    // Log in button should not be visible when signed in
    expect(await homePage.getLoginButton()).not.toBeVisible;

    // Open account menu
    await (await homePage.getAccountMenu()).click();

    // Assert correct account log in
    const displayedUsername = homePage.page.locator('ytd-multi-page-menu-renderer #header'); 
    expect(displayedUsername).toHaveText(/solorioth@gmail.com/);
  });

  test('Assert subscribing action', async({ homePage, searchResultsPage }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 90000);

    // Search for channel to subscribe to
    await homePage.searchQuery('Porter Robinson Channel');

    // Wait for page to load
    await homePage.page.waitForTimeout(2000);

    // Locate first channel result
    const channelSearches = await searchResultsPage.getChannelSearchResultsList();
    const channel = channelSearches[0];

    // Subscribe to first channel result
    const subscribeButton = channel.locator('#subscribe-button');
    await subscribeButton.click();

    // Assert Subscription added popup appears
    const subscriptionAddedPopup = searchResultsPage.page.locator('#toast #text').filter({ hasText: 'Subscription added'} );
    await searchResultsPage.page.addLocatorHandler(subscriptionAddedPopup, async() => {
      await expect(subscriptionAddedPopup).toBeVisible({timeout: 3000});
    });

    // Refresh page
    await searchResultsPage.page.reload();

    // Open guide menu
    await searchResultsPage.openGuideMenu();

    // Assert subscribed channel shows in Subscriptions list in the Guide menu
    const subscriptionsList = searchResultsPage.page.locator('#guide ytd-guide-section-renderer').filter({ hasText: /Subscriptions/});
    const subscriptionsListEntryLocator = subscriptionsList.locator('ytd-guide-entry-renderer');
    const filteredChannel = subscriptionsListEntryLocator.filter({ hasText: 'Porter Robinson' });
    await expect(filteredChannel.locator('a')).toHaveAttribute('title', 'Porter Robinson');

    // Click all subscriptions button
    const allSubscriptionsEntry = subscriptionsListEntryLocator.filter({ hasText: 'All subscriptions' });
    await allSubscriptionsEntry.click();

    await searchResultsPage.page.waitForTimeout(2000);

    // Assert subscription button text is Subscribed
    const filteredSubscription = searchResultsPage.page.locator('#contents ytd-channel-renderer').filter({ hasText: /Porter Robinson/ }).nth(1);
    const filteredSubscriptionSubscribeButton = filteredSubscription.locator('ytd-subscribe-button-renderer');
    await expect(filteredSubscription).toHaveText(/Subscribed/);
    await expect(filteredSubscriptionSubscribeButton).toHaveAttribute('subscribed');

    // Set up handler for unsubscribe pop up
    const unsubscribePopup = searchResultsPage.page.locator('yt-confirm-dialog-renderer').filter({hasText: /Unsubscribe from/});
    await searchResultsPage.page.addLocatorHandler(unsubscribePopup, async() => {
      await unsubscribePopup.locator('#confirm-button').click();
    });

    // Unsubscribe from channel
    await filteredSubscriptionSubscribeButton.scrollIntoViewIfNeeded();
    await filteredSubscriptionSubscribeButton.click();
    const unsubscribeButton = searchResultsPage.page.locator('ytd-menu-popup-renderer').getByRole('listbox').locator('ytd-menu-service-item-renderer').filter({ hasText: 'Unsubscribe' });
    await unsubscribeButton.click();

    // Assert Subscription removed popup appears
    const subscriptionRemovedPopup = searchResultsPage.page.locator('#toast #text').filter({ hasText: 'Subscription removed'} );
    await searchResultsPage.page.addLocatorHandler(subscriptionRemovedPopup, async() => {
      await expect(subscriptionRemovedPopup).toBeVisible({timeout: 3000});
    });
    
    // Assert that button text becomes Subscribe
    await expect(filteredSubscription).toHaveText(/Subscribe/);
    await expect(filteredSubscription).not.toHaveAttribute('subscribed');

    // Assert subscribed channel leaves Subscriptions list
    await expect(subscriptionsList.nth(1)).not.toHaveText(/Porter Robinson/);
  });

  test('Assert Subscriptions page has videos from subscribed channels', async({ homePage, searchResultsPage }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 40000);

    // Search for channel to subscribe to
    await homePage.searchQuery('Porter Robinson Channel');

    // Wait for page to load
    await homePage.page.waitForTimeout(1000);

    // Locate first channel result
    const channelSearches = await searchResultsPage.getChannelSearchResultsList();
    const channel = channelSearches[0];

    // Subscribe to first channel result
    const subscribeButton = channel.locator('#subscribe-button');
    await subscribeButton.click();

    // Navigate to Subscriptions page
    await searchResultsPage.navigateToGuideItem('Subscriptions');

    // Assert that channel is present in the videos section
    const subscriptionsPageContents = searchResultsPage.page.locator('ytd-rich-grid-renderer > div').filter({ has: searchResultsPage.page.locator('#contents') }).filter({ hasText: /Latest/ });
    await expect(subscriptionsPageContents).toHaveText(/Porter Robinson/);

    // Unsubscribe from channel
    await searchResultsPage.openGuideMenu();
    const subscriptionsList = searchResultsPage.page.locator('#guide ytd-guide-section-renderer').filter({ hasText: /Subscriptions/});
    const subscriptionsListEntryLocator = subscriptionsList.locator('ytd-guide-entry-renderer');
    const filteredChannel = subscriptionsListEntryLocator.filter({ hasText: 'Porter Robinson' });
    await filteredChannel.click();
    const subscribedButton = searchResultsPage.page.getByRole('button').getByText(/Subscribed/);
    await subscribedButton.click();
  })