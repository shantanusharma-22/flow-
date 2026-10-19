import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:8901';

test('F04: Offline Storage and Granular Cache Eviction (Fix #899)', async (t) => {
  await t.test('F04-H1: Mark track as downloaded for offline playback', async () => {
    const res = await fetch(`${BASE_URL}/api/tracks/track-04/download`, {
      method: 'POST'
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.trackId, 'track-04');
    assert.equal(data.isDownloaded, true);

    const trackRes = await fetch(`${BASE_URL}/api/tracks/track-04`);
    const track = await trackRes.json();
    assert.equal(track.isDownloaded, 1);
  });

  await t.test('F04-H2: Granular cache inspection returns allocated MB and per-track records (Fix #899)', async () => {
    const res = await fetch(`${BASE_URL}/api/cache`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.totalMb > 0, 'Total allocated cache MB should be greater than 0');
    assert.ok(data.count > 0, 'Should have cached tracks');
    assert.ok(data.tracks[0].sizeMb > 0, 'Track record should report size in MB');
  });

  await t.test('F04-H3: Single-track eviction deletes targeted song while preserving rest (Fix #899)', async () => {
    // 0. Ensure track-02 is cached initially
    await fetch(`${BASE_URL}/api/tracks/track-02/download`, { method: 'POST' });

    // 1. Check initial count
    const initialRes = await fetch(`${BASE_URL}/api/cache`);
    const initialData = await initialRes.json();
    const initialCount = initialData.count;

    // 2. Evict track-02
    const deleteRes = await fetch(`${BASE_URL}/api/cache/track-02`, {
      method: 'DELETE'
    });
    assert.equal(deleteRes.status, 200);
    const deleteData = await deleteRes.json();
    assert.equal(deleteData.success, true);
    assert.equal(deleteData.trackId, 'track-02');

    // 3. Verify track-02 is removed and remaining count is initialCount - 1
    const postRes = await fetch(`${BASE_URL}/api/cache`);
    const postData = await postRes.json();
    assert.equal(postData.count, initialCount - 1, 'Total cached tracks should decrease by exactly 1');
    assert.equal(postData.tracks.some((t: any) => t.id === 'track-02'), false, 'track-02 should no longer be cached');
  });
});
