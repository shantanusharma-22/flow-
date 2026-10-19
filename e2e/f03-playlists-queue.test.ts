import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:8901';

test('F03: Zero-Login Playlists, M3U8 Export, and Queue Reordering', async (t) => {
  let createdPlaylistId = '';

  await t.test('F03-H1: Create local playlist without requiring cloud account (Fix #904)', async () => {
    const payload = {
      title: 'Midnight Coding Flow',
      description: 'Zero-login local playlist for engineering sessions'
    };

    const res = await fetch(`${BASE_URL}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.ok(data.id.startsWith('local-pl-'), 'ID should follow local playlist schema');
    assert.equal(data.title, 'Midnight Coding Flow');
    assert.equal(data.isCustom, true);
    assert.equal(data.source, 'local');
    createdPlaylistId = data.id;
  });

  await t.test('F03-E1: Empty playlist title is rejected with 400 Bad Request', async () => {
    const payload = { title: '' };
    const res = await fetch(`${BASE_URL}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    assert.equal(res.status, 400);
  });

  await t.test('F03-H2: Add track to playlist and verify ordered table', async () => {
    assert.ok(createdPlaylistId, 'Playlist ID must exist from previous test');

    const addRes = await fetch(`${BASE_URL}/api/playlists/${createdPlaylistId}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId: 'track-01' })
    });
    assert.equal(addRes.status, 201);

    const getRes = await fetch(`${BASE_URL}/api/playlists/${createdPlaylistId}`);
    assert.equal(getRes.status, 200);
    const pl = await getRes.json();
    assert.equal(pl.tracks.length, 1);
    assert.equal(pl.tracks[0].id, 'track-01');
    assert.equal(pl.tracks[0].title, 'Neon Odyssey');
  });

  await t.test('F03-H3: Export playlist to standard .m3u8 file format', async () => {
    const res = await fetch(`${BASE_URL}/api/playlists/playlist-01/export-m3u`);
    assert.equal(res.status, 200);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    assert.ok(contentType.includes('mpegurl') || contentType.includes('text/plain'), 'Content-Type should be mpegURL');

    const body = await res.text();
    assert.ok(body.startsWith('#EXTM3U'), 'Should start with #EXTM3U header');
    assert.ok(body.includes('#PLAYLIST:Flow Discover Weekly'), 'Should contain playlist name tag');
    assert.ok(body.includes('#EXTINF:214,Luna Synth - Neon Odyssey'), 'Should contain track metadata line');
  });

  await t.test('F03-H4: Reorder active playback queue positions in SQLite', async () => {
    const newOrder = ['track-04', 'track-02', 'track-01'];
    const reorderRes = await fetch(`${BASE_URL}/api/queue/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedTrackIds: newOrder })
    });
    assert.equal(reorderRes.status, 200);

    const getRes = await fetch(`${BASE_URL}/api/queue`);
    assert.equal(getRes.status, 200);
    const data = await getRes.json();
    assert.equal(data.queue[0].id, 'track-04', 'First item in queue should be track-04');
    assert.equal(data.queue[1].id, 'track-02', 'Second item in queue should be track-02');
  });
});
