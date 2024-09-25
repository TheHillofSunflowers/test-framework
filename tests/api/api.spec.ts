import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable not set');
}

test.describe('API Tests', () => {
    test('Fetch video details by ID', async({ request }) => {
        const videoId = 'bdXPhRj10jQ';
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoId,
                key: apiKey,
            },
        });
    
        expect(response.status()).toBe(200);
        const data = await response.json();

        const videoTitle = data.items[0].snippet.title;
        const viewCount = data.items[0].statistics.viewCount;
        
        console.log('Video Title:', videoTitle);
        console.log('View Count:', viewCount);
    
        expect(videoTitle).toEqual('Porter Robinson - Hollowheart ft. Amy Millan (Worlds 10th Anniversary Edition)');
        expect(parseInt(viewCount, 10)).toBeGreaterThan(520000);
    });

});