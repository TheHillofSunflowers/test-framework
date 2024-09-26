import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';

dotenv.config();

// Set API Key
const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable not set');
}

test.describe('Video API Tests', () => {
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

        // Get video details
        const kind = data.items[0].kind;
        const apiID = data.items[0].id;
        const videoTitle = data.items[0].snippet.title;
        const description = data.items[0].snippet.description;
        const channelTitle = data.items[0].snippet.channelTitle;
        const duration = data.items[0].contentDetails.duration;
        const viewCount = data.items[0].statistics.viewCount;
    
        // Assert video details
        expect(kind).toBe('youtube#video');
        expect(apiID).toBe(videoId);
        expect(videoTitle).toBe('Porter Robinson - Hollowheart ft. Amy Millan (Worlds 10th Anniversary Edition)');
        expect(description).toContain('WORLDS 10th Anniversary Edition ft. Hollowheart ++ AND!! ++ Worlds Live, printed to Vinyl for the first time ever!');
        expect(channelTitle).toBe('Porter Robinson');
        expect(duration).toBe('PT3M50S');
        expect(parseInt(viewCount, 10)).toBeGreaterThan(520000);
    });

    test('Fetch video with random ID', async({ request }) => {
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                // Input random ID
                id: 'dwasdwWDAS234',
                key: apiKey,
            },
        });

        // Assert OK status
        expect(response.status()).toBe(200);
        const data = await response.json();

        // Assert that no video details are returned
        expect(data.items).toHaveLength(0);
    });

    test('Fetch video without ID', async({ request }) => {
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                // Do not input an ID
                key: apiKey,
            },
        });

        // Assert OK status
        expect(response.status()).toBe(400);
        const data = await response.json();

        // Assert that no video details are returned
        expect(data.error.errors[0].reason).toBe('missingRequiredParameter');
    });
});

test.describe('Unauthorized API tests', () => {
    test('Unauthorized Like video with API', async({ request }) => {
        const response = await request.post('https://www.googleapis.com/youtube/v3/videos/rate', {
            params: {
                // Input random ID
                id: 'bdXPhRj10jQ',
                rating: 'like',
                key: apiKey,
            },
        });

        // Assert unauthorized status
        expect(response.status()).toBe(401);
    });

    test('Unauthorized Dislike video with API', async({ request }) => {
        const response = await request.post('https://www.googleapis.com/youtube/v3/videos/rate', {
            params: {
                // Input random ID
                id: 'bdXPhRj10jQ',
                rating: 'dislike',
                key: apiKey,
            },
        });

        // Assert unauthorized status
        expect(response.status()).toBe(401);
    });
});

test('Fetch expected Caption through API', async({ request }) => {
    const response = await request.get('https://www.googleapis.com/youtube/v3/captions', {
        params: {
            // Input random ID
            part: 'id,snippet',
            videoId: 'bdXPhRj10jQ',
            key: apiKey,
        },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    const track1 = data.items[0];
    const track2 = data.items[1];
    const track3 = data.items[2];

    // Assert details of fetched Caption data
    for (let track of data.items) {
        expect(track.kind).toBe('youtube#caption');
        expect(track.snippet.videoId).toBe('bdXPhRj10jQ');
    }

    expect(track1.id).toBe('AUieDaZ1KfXJIEVAmnYAhaFV3s2f43XGj8vXYG2AZCsNqO2RZk4');
    expect(track1.snippet.trackKind).toBe('asr');
    expect(track1.snippet.language).toBe('en');

    expect(track2.id).toBe('AUieDaacyEd-Rk1YQ87ymHDz8DZ6ZVa7w0JAwXlo8ep2');
    expect(track2.snippet.trackKind).toBe('standard');
    expect(track2.snippet.language).toBe('ja');

    expect(track3.id).toBe('AUieDaZ9E6qdNbn746y8-gYVxRtRKGtdO00Tb2F733ya');
    expect(track3.snippet.trackKind).toBe('standard');
    expect(track3.snippet.language).toBe('en');
});