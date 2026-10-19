import test from 'node:test';
import assert from 'node:assert/strict';

const FRONTEND_URL = 'http://localhost:4173';
const BACKEND_URL = 'http://127.0.0.1:8901';

test('F06: End-to-End Frontend-to-Backend Full Working Integration', async (t) => {
  await t.test('F06-H1: Frontend preview server serves production bundle with Flow branding', async () => {
    const res = await fetch(`${FRONTEND_URL}/`);
    assert.equal(res.status, 200, 'Frontend preview server must respond with 200 OK');
    const html = await res.text();
    assert.ok(html.includes('<title>Flow'), 'HTML must include Flow page title');
    assert.ok(html.includes('/assets/index-'), 'HTML must reference compiled asset chunks');
  });

  await t.test('F06-H2: Backend API health check is live and healthy', async () => {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    assert.equal(res.status, 200, 'Health check must respond with 200 OK');
    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.equal(data.product, 'Flow Music Player Backend');
  });

  await t.test('F06-H3: Live catalog search queries SQLite and returns typed track data', async () => {
    const res = await fetch(`${BACKEND_URL}/api/search?q=neon&category=all`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.results.songs.length > 0, 'Must return matched songs');
    const song = data.results.songs[0];
    assert.equal(song.title, 'Neon Odyssey');
    assert.equal(song.artist, 'Luna Synth');
    assert.ok(song.streamUrl.length > 0, 'Stream URL must be defined');
  });

  await t.test('F06-H4: Synchronized lyrics endpoint serves millisecond line timing & Romaji', async () => {
    const res = await fetch(`${BACKEND_URL}/api/tracks/track-01/lyrics`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.trackId, 'track-01');
    assert.equal(data.isSynced, true);
    assert.ok(data.lines.length >= 4, 'Must contain multiple synced stanzas');
    assert.ok(data.lines[1].romanized.length > 0, 'Must contain phonetic romanization');
  });

  await t.test('F06-H5: Audio scrobble records playback and increments play count in SQLite', async () => {
    const getRes = await fetch(`${BACKEND_URL}/api/tracks/track-01`);
    const beforeTrack = await getRes.json();
    const initialPlayCount = beforeTrack.playCount || 0;

    const scrobbleRes = await fetch(`${BACKEND_URL}/api/tracks/track-01/scrobble`, { method: 'POST' });
    assert.equal(scrobbleRes.status, 200);
    const scrobbleData = await scrobbleRes.json();
    assert.equal(scrobbleData.trackId, 'track-01');
    assert.equal(scrobbleData.playCount, initialPlayCount + 1, 'Play count must increment by 1');
  });

  await t.test('F06-H6: Like toggle updates track like status in SQLite', async () => {
    const res1 = await fetch(`${BACKEND_URL}/api/tracks/track-02/like`, { method: 'POST' });
    assert.equal(res1.status, 200);
    const data1 = await res1.json();
    assert.equal(data1.trackId, 'track-02');

    const res2 = await fetch(`${BACKEND_URL}/api/tracks/track-02/like`, { method: 'POST' });
    assert.equal(res2.status, 200);
    const data2 = await res2.json();
    assert.equal(data2.isLiked, !data1.isLiked, 'Second toggle must invert isLiked');
  });

  await t.test('F06-H7: Local playlist creation persists to SQLite database', async () => {
    const payload = {
      title: 'Full Working Verification Playlist',
      description: 'Automated end-to-end integration verification'
    };

    const res = await fetch(`${BACKEND_URL}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const created = await res.json();
    assert.equal(created.title, payload.title);
    assert.ok(created.id.startsWith('local-pl-'));

    // Verify it is returned in playlists list
    const listRes = await fetch(`${BACKEND_URL}/api/playlists`);
    const allPlaylists = await listRes.json();
    const found = allPlaylists.find((p: any) => p.id === created.id);
    assert.ok(found, 'Created playlist must appear in playlist list');
  });

  await t.test('F06-H8: User settings persist and read back from SQLite', async () => {
    const settingsUpdate = {
      theme_mode: 'oled_black',
      audio_quality: 'lossless',
      crossfade_sec: '4'
    };

    const putRes = await fetch(`${BACKEND_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsUpdate)
    });

    assert.equal(putRes.status, 200);

    const getRes = await fetch(`${BACKEND_URL}/api/settings`);
    assert.equal(getRes.status, 200);
    const saved = await getRes.json();
    assert.equal(saved.theme_mode, 'oled_black');
    assert.equal(saved.audio_quality, 'lossless');
    assert.equal(saved.crossfade_sec, '4');
  });
});
