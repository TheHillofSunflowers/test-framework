import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';
import * as utils from '../utils';

dotenv.config();

const data = utils.loadTestData('tests/data/data.json');

const testVideo = data.video?.[0];
if (!testVideo) {
    throw new Error('No video data found in the provided JSON file');
}

const {
    kind,
    id,
    title,
    channel,
    duration,
    description,
    viewCount,
} = testVideo;

// Set API Key
const apiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable not set');
}

test.describe('Video API Tests', () => {
    test('Fetch video details by ID', async({ request }) => {
        const videoId = id; // Video ID
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
        const dataReceived = await response.json();
        if (!dataReceived.items || dataReceived.items.length === 0) {
            throw new Error(`No video details found for ID: ${videoId}`);
        }

        // Destructure video details
        const {
            kind: receivedKind,
            id: receivedId,
            snippet: {
                title: receivedTitle,
                description: receivedDescription,
                channelTitle: receivedChannelTitle,
            },
            contentDetails: { duration: receivedDuration },
            statistics: { viewCount: receivedViewCount },
        } = dataReceived.items[0];
    
        // Assert video details
        expect(receivedKind).toBe(kind);
        expect(receivedId).toBe(id);
        expect(receivedTitle).toBe(title);
        expect(receivedDescription).toContain(description);
        expect(receivedChannelTitle).toBe(channel);
        expect(receivedDuration).toBe(duration);

        const parsedViewCount = parseInt(receivedViewCount, 10);
        expect(parsedViewCount).not.toBeNaN();
        expect(parsedViewCount).toBeGreaterThan(viewCount);
    });

    test('should return no video data for an invalid video ID', async({ request }) => {
        const invalidID = 'dwasdwWDAS234';
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                // Input random ID
                id: invalidID,
                key: apiKey,
            },
        });

        // Assert OK status
        expect(response.status()).toBe(200);
        const dataReceived = await response.json();

        // Assert that no video details are returned
        expect(dataReceived.items).toBeDefined();
        expect(dataReceived.items).toHaveLength(0);
    });

    test('should return an error when fetching a video without specifying ID', async({ request }) => {
        const response = await request.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                // Do not input an ID
                key: apiKey,
            },
        });

        // Assert OK status
        expect(response.status()).toBe(400);
        const dataReceived = await response.json();

        // Assert that no video details are returned
        expect(dataReceived.error).toBeDefined();
        expect(dataReceived.error.errors).toBeDefined();
        expect(dataReceived.error.errors[0].reason).toBe('missingRequiredParameter');
    });
});

test.describe('Unauthorized API tests', () => {
    test('Unauthorized Like video with API', async({ request }) => {
        const response = await request.post('https://www.googleapis.com/youtube/v3/videos/rate', {
            params: {
                id: id,
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
                id: id,
                rating: 'dislike',
                key: apiKey,
            },
        });

        // Assert unauthorized status
        expect(response.status()).toBe(401);
    });
});

test.describe('YouTube Caption API Tests', () => {
    // Save caption data into an array for easier iteration
    const expectedCaptions = testVideo.caption.map((caption: { kind: string, videoId: string, id: string; trackKind: string; language: string; }) => ({
        kind: caption.kind,
        videoId: caption.videoId,
        id: caption.id,
        trackKind: caption.trackKind,
        language: caption.language
    }));

    test('Fetch expected Caption through API', async({ request }) => {
        const response = await request.get('https://www.googleapis.com/youtube/v3/captions', {
            params: {
                part: 'id,snippet',
                videoId: id,
                key: apiKey,
            },
        });

        expect(response.status()).toBe(200);
        const dataReceived = await response.json();

        expect(dataReceived.items.length).toBe(expectedCaptions.length)

        dataReceived.items.forEach((track: any, index: number) => {
            const { kind, videoId, id, trackKind, language } = expectedCaptions[index];

            // Assert general details
            expect(track.kind).toBe(kind);
            expect(track.snippet.videoId).toBe(videoId);

            // Assert track-specific details
            expect(track.id).toBe(id);
            expect(track.snippet.trackKind).toBe(trackKind);
            expect(track.snippet.language).toBe(language);
        });
    });
});