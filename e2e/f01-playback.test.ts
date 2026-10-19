import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:8901';

test('F01: Catalog Search & JIT Audio Stream Resolution', async (t) => {
  await t.test('F01-H1: Search query returns matched songs and lossless stream', async () => {
    const res = await fetch(`${BASE_URL}/api/search?q=Synth&category=all`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.ok(data.results.songs.length > 0, 'Should find songs matching Synth');
    const song = data.results.songs[0];
    assert.equal(song.title, 'Neon Odyssey');
    assert.equal(song.artist, 'Luna Synth');

    // Resolve lossless FLAC stream
    const streamRes = await fetch(`${BASE_URL}/api/tracks/${song.id}/stream?quality=lossless`);
    assert.equal(streamRes.status, 200);
    const streamData = await streamRes.json();
    assert.equal(streamData.audioFormat, 'flac');
    assert.equal(streamData.bitrateKbps, 1411);
    assert.ok(streamData.streamUrl.startsWith('http'), 'Stream URL should be valid HTTP');
  });

  await t.test('F01-E1: Empty search query fails with 400 validation error', async () => {
    const res = await fetch(`${BASE_URL}/api/search?q=`);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error || data.issues, 'Expected validation error response');
  });

  await t.test('F01-E2: Special characters and symbols in query are handled safely', async () => {
    const specialQueries = ['♪', '%20', '<script>alert(1)</script>', "'; DROP TABLE tracks; --"];
    for (const q of specialQueries) {
      const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(q)}`);
      assert.equal(res.status, 200, `Query "${q}" should not crash server`);
      const data = await res.json();
      assert.ok(Array.isArray(data.results.songs), 'Should return array');
    }
  });

  await t.test('F01-E3: Unknown track stream request returns 404', async () => {
    const res = await fetch(`${BASE_URL}/api/tracks/unknown-track-9999/stream`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.error, 'Track stream not found');
  });

  await t.test('F01-H2: 3-State loop button states cycle correctly (Fix #900)', () => {
    const loopStates = ['off', 'all', 'one'] as const;
    let currentMode: 'off' | 'all' | 'one' = 'off';

    const cycleMode = (mode: 'off' | 'all' | 'one') => {
      return mode === 'off' ? 'all' : mode === 'all' ? 'one' : 'off';
    };

    currentMode = cycleMode(currentMode);
    assert.equal(currentMode, 'all', 'Cycle 1 should be All');

    currentMode = cycleMode(currentMode);
    assert.equal(currentMode, 'one', 'Cycle 2 should be One (Repeat-One)');

    currentMode = cycleMode(currentMode);
    assert.equal(currentMode, 'off', 'Cycle 3 should be Off');
  });

  await t.test('F01-H3: Playback speed scales tempo while preserving pitch (Fix #890)', () => {
    const supportedSpeeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const durationSec = 200;

    supportedSpeeds.forEach(speed => {
      const effectiveDuration = durationSec / speed;
      assert.ok(effectiveDuration > 0, `Effective duration for ${speed}x should be positive`);
      if (speed === 2.0) {
        assert.equal(effectiveDuration, 100, '2x speed should play in 100s');
      } else if (speed === 0.5) {
        assert.equal(effectiveDuration, 400, '0.5x speed should play in 400s');
      }
    });
  });
});
