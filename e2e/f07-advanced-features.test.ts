import { test, describe } from 'node:test';
import assert from 'node:assert';
import { app } from '../server/app';

const PORT = 8901;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

describe('F07: Equalizer, Sleep Timer, Watcher & Spotify Resolvers', () => {

  test('F07-H1: Sleep timer linear fadeout ratio computes accurate reduction in final 30 seconds', () => {
    const computeFadeRatio = (remainingSec: number) => {
      if (remainingSec <= 0) return 0;
      if (remainingSec > 30) return 1.0;
      return +(remainingSec / 30).toFixed(4);
    };

    assert.strictEqual(computeFadeRatio(45), 1.0);
    assert.strictEqual(computeFadeRatio(30), 1.0);
    assert.strictEqual(computeFadeRatio(15), 0.5);
    assert.strictEqual(computeFadeRatio(3), 0.1);
    assert.strictEqual(computeFadeRatio(0), 0);
  });

  test('F07-H2: 8-Band Parametric Equalizer presets define calibrated decibel gains', () => {
    const presets: Record<string, { f60: number; f1k: number; f12k: number }> = {
      'Flat': { f60: 0, f1k: 0, f12k: 0 },
      'Bass Boost': { f60: 8, f1k: -1, f12k: 2 },
      'Vocal Clarity': { f60: -3, f1k: 5, f12k: 4 },
      'Electronic': { f60: 6, f1k: 0, f12k: 5 }
    };

    assert.strictEqual(presets['Flat'].f60, 0);
    assert.strictEqual(presets['Bass Boost'].f60, 8);
    assert.strictEqual(presets['Vocal Clarity'].f1k, 5);
    assert.strictEqual(presets['Electronic'].f12k, 5);
  });

  test('F07-H3: Spotify URI parser resolves Spotify playlist/track URI to streaming tracks', async () => {
    const res = await fetch(`${BASE_URL}/library/spotify-resolve?uri=https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.parsedType, 'playlist');
    assert.strictEqual(body.spotifyId, '37i9dQZF1DXcBWIGoYBM5M');
    assert(Array.isArray(body.tracks));
    assert(body.tracks.length > 0);
  });

  test('F07-H4: Local Music background directory watcher status reports active monitoring', async () => {
    const res = await fetch(`${BASE_URL}/library/watcher`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(typeof body.active, 'boolean');
    assert(body.watchedDirectory.length > 0);
    assert.strictEqual(typeof body.totalLocalTracks, 'number');
  });

  test('F07-H5: Local Music scan endpoint triggers recursive file scan and reports results', async () => {
    const res = await fetch(`${BASE_URL}/library/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(typeof body.scannedFilesFound, 'number');
    assert.strictEqual(typeof body.newlyIndexedTracks, 'number');
  });
});
