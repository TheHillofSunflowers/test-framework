import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

// Set API Key
const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable not set');
}

test.describe('API Tests', () => {
    test('Fetch video details by ID', async({ request }) => {
        const videoId = 'bdXPhRj10jQ'; // Hollowheart Video ID
        // Get response by sending a request with body parameters
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: apiKey,
            },
        });
    
        // Assert OK status
        expect(response.status()).toBe(200);
        const data = await response.json();

        // Get title and view count
        const videoTitle = data.items[0].snippet.title;
        const viewCount = data.items[0].statistics.viewCount;
    
        // Assert title and view count
        expect(videoTitle).toEqual('Porter Robinson - Hollowheart ft. Amy Millan (Worlds 10th Anniversary Edition)');
        expect(parseInt(viewCount, 10)).toBeGreaterThan(520000);
    });

});