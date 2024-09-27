import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const data = JSON.parse(fs.readFileSync('tests/data/data.json', 'utf8'));

const kind = data.video[0].kind;
const id = data.video[0].id;
const title = data.video[0].title;
const channel = data.video[0].channel;
const duration = data.video[0].duration;
const description = data.video[0].description;
const viewCount = data.video[0].viewCount;

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

        // Get video details
        const apiKind = dataReceived.items[0].kind;
        const apiID = dataReceived.items[0].id;
        const videoTitle = dataReceived.items[0].snippet.title;
        const videoDescription = dataReceived.items[0].snippet.description;
        const channelTitle = dataReceived.items[0].snippet.channelTitle;
        const apiDuration = dataReceived.items[0].contentDetails.duration;
        const apiViewCount = dataReceived.items[0].statistics.viewCount;
    
        // Assert video details
        expect(apiKind).toBe(kind);
        expect(apiID).toBe(id);
        expect(videoTitle).toBe(title);
        expect(videoDescription).toContain(description);
        expect(channelTitle).toBe(channel);
        expect(apiDuration).toBe(duration);
        expect(parseInt(apiViewCount, 10)).toBeGreaterThan(viewCount);
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
        const dataReceived = await response.json();

        // Assert that no video details are returned
        expect(dataReceived.items).toHaveLength(0);
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
        const dataReceived = await response.json();

        // Assert that no video details are returned
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

const captionKind = data.video[0].caption[0].kind;
const captionVideoId = data.video[0].caption[0].videoId;
let captionId = data.video[0].caption[0].id;
let captionTrackKind = data.video[0].caption[0].trackKind;
let captionlanguage = data.video[0].caption[0].language;

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

    const track1 = dataReceived.items[0];
    const track2 = dataReceived.items[1];
    const track3 = dataReceived.items[2];

    // Assert details of fetched Caption data
    for (let track of dataReceived.items) {
        expect(track.kind).toBe(captionKind);
        expect(track.snippet.videoId).toBe(captionVideoId);
    }

    // Assert track 1 details
    expect(track1.id).toBe(captionId);
    expect(track1.snippet.trackKind).toBe(captionTrackKind);
    expect(track1.snippet.language).toBe(captionlanguage);

    captionId = data.video[0].caption[1].id;
    captionTrackKind = data.video[0].caption[1].trackKind;
    captionlanguage = data.video[0].caption[1].language;

    // Assert track 2 details
    expect(track2.id).toBe(captionId);
    expect(track2.snippet.trackKind).toBe(captionTrackKind);
    expect(track2.snippet.language).toBe(captionlanguage);

    captionId = data.video[0].caption[2].id;
    captionTrackKind = data.video[0].caption[2].trackKind;
    captionlanguage = data.video[0].caption[2].language;

    // Assert track 3 details
    expect(track3.id).toBe(captionId);
    expect(track3.snippet.trackKind).toBe(captionTrackKind);
    expect(track3.snippet.language).toBe(captionlanguage);
});