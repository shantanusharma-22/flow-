import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://127.0.0.1:8901';

test('F02: Synchronized Lyrics, Romanization, and LRC Export', async (t) => {
  await t.test('F02-H1: Retrieve synchronized lyrics with millisecond line timestamps', async () => {
    const res = await fetch(`${BASE_URL}/api/lyrics/tracks/track-01/lyrics`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.trackId, 'track-01');
    assert.equal(data.isSynced, true);
    assert.ok(Array.isArray(data.lines), 'Lines should be an array');
    assert.ok(data.lines.length >= 4, 'Should have at least 4 synced lines');
    assert.ok(data.lines[1].startTimeMs > 0, 'Line 1 should have start time');
    assert.ok(data.lines[1].text.length > 0, 'Line should have text');
  });

  await t.test('F02-H2: Correctly maps active stanza index for seeking at 22000ms', async () => {
    const res = await fetch(`${BASE_URL}/api/lyrics/tracks/track-01/lyrics`);
    const data = await res.json();
    const currentTimeMs = 22000;

    const activeIndex = data.lines.findIndex((line: any) =>
      currentTimeMs >= line.startTimeMs && currentTimeMs <= line.endTimeMs
    );

    assert.ok(activeIndex >= 0, 'Should find active line matching 22000ms');
    assert.ok(data.lines[activeIndex].text.includes('誰も知らない'), 'Active line should be the secret pulse stanza');
  });

  await t.test('F02-E1: Track without synced lyrics returns graceful fallback', async () => {
    const res = await fetch(`${BASE_URL}/api/lyrics/tracks/track-04/lyrics`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.isSynced, false);
    assert.equal(data.lines.length, 0);
  });

  await t.test('F02-H3: Phonetic Romanization generator transliterates Asian scripts (Fix #364)', async () => {
    const payload = {
      lines: [
        { startTimeMs: 8500, endTimeMs: 14200, text: '夜の街に揺れるネオンの光' },
        { startTimeMs: 14200, endTimeMs: 20400, text: '遠くへと消えていく影を追う' }
      ]
    };

    const res = await fetch(`${BASE_URL}/api/lyrics/romanize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.romanizedLines[0].romanized.includes('Yoru no machi'), 'Line 0 should have Romaji transliteration');
    assert.ok(data.romanizedLines[1].romanized.includes('Tooku e to'), 'Line 1 should have Romaji transliteration');
  });

  await t.test('F02-H4: Export standard .lrc file formatted with [mm:ss.xx] timestamps (Fix #909)', async () => {
    const payload = {
      trackId: 'track-01',
      title: 'Neon Odyssey',
      artist: 'Luna Synth'
    };

    const res = await fetch(`${BASE_URL}/api/lyrics/export-lrc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 200);
    const lrcText = await res.text();
    assert.ok(lrcText.includes('[00:08.50]'), 'LRC file should contain standard [mm:ss.xx] timestamp');
    assert.ok(lrcText.includes('夜の街に揺れるネオンの光'), 'LRC file should contain lyric text');
  });
});
