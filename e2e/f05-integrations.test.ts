import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:8901';

test('F05: External Browser OAuth, Scrobbling, and Discord RPC', async (t) => {
  await t.test('F05-H1: External browser OAuth loop generates loopback redirect (Fix #903)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/external-oauth?provider=spotify`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.provider, 'spotify');
    assert.ok(data.authUrl.includes('accounts.spotify.com/authorize'), 'authUrl should target Spotify OAuth');
    assert.ok(data.redirectUri.includes('127.0.0.1:8901/api/auth/callback/spotify'), 'Redirect URI should use local loopback');
    assert.ok(data.state.length > 0, 'State parameter should be generated for CSRF protection');
  });

  await t.test('F05-H2: Scrobble at 60% playback records play count and triggers Last.fm hook', async () => {
    const payload = {
      trackId: 'track-01',
      timestamp: Date.now(),
      playbackPercentage: 60
    };

    const res = await fetch(`${BASE_URL}/api/integrations/scrobble`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.scrobbled, true);
    assert.equal(data.trackId, 'track-01');
    assert.ok(data.services.includes('Last.fm (Simulated)'));
  });

  await t.test('F05-E1: Early skip under 50% does not trigger scrobble', async () => {
    const payload = {
      trackId: 'track-01',
      timestamp: Date.now(),
      playbackPercentage: 35
    };

    const res = await fetch(`${BASE_URL}/api/integrations/scrobble`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.scrobbled, false);
    assert.equal(data.reason, 'Playback under 50% threshold');
  });

  await t.test('F05-H3: Discord Rich Presence payload formats active listening state', async () => {
    const payload = {
      trackTitle: 'Neon Odyssey',
      artistName: 'Luna Synth',
      durationSec: 214,
      currentTimeSec: 65,
      isPlaying: true
    };

    const res = await fetch(`${BASE_URL}/api/integrations/discord-rpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.discordStatus.details, 'Listening to Neon Odyssey');
    assert.equal(data.discordStatus.state, 'by Luna Synth');
  });
});
