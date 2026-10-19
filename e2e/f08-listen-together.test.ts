import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateJamCode, normalizeJamCode } from '../server/routes/jam';

const BASE_URL = 'http://127.0.0.1:8901';

describe('F08: Listen Together / Jam Party Protocol & Synchronization', () => {
  test('F08-H1: Party code generator produces BitChord-compatible 6-character codes with Crockford Base32 normalization', () => {
    const code = generateJamCode();
    assert.strictEqual(code.length, 6, 'Code should be exactly 6 characters');
    assert.match(code, /^[0-9A-Z]+$/, 'Code must contain only Base32 alphanumeric characters');

    // Test BitChord normalizer rules: spaces/dashes removed, I/L -> 1, O -> 0
    assert.strictEqual(normalizeJamCode('fl-ow26'), 'F10W26', 'L maps to 1 and O maps to 0');
    assert.strictEqual(normalizeJamCode('  ab-cd-ef  '), 'ABCDEF');
    assert.strictEqual(normalizeJamCode('OIL1'), '0111', 'O should map to 0 and I/L to 1');
  });

  test('F08-H2: Host creates a new Jam room and receives host status and invite link', async () => {
    const res = await fetch(`${BASE_URL}/api/jam/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'Audiophile Sanctuary',
        userName: 'Shantanu',
        hostOnlyControl: true,
        currentTrack: {
          id: 'test-track-01',
          title: 'Starry Night Resonance',
          artist: 'Flow Studio',
          album: 'Cosmic Beats',
          durationSec: 240,
          streamUrl: 'https://cdn.flowplayer.local/audio/cosmic.flac'
        }
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json() as any;

    assert.ok(data.room, 'Room object must be returned');
    assert.strictEqual(data.room.name, 'Audiophile Sanctuary');
    assert.strictEqual(data.room.hostName, 'Shantanu');
    assert.strictEqual(data.room.hostOnlyControl, true);
    assert.strictEqual(data.member.isHost, true);
    assert.ok(data.inviteUrl.includes(data.room.code), 'Invite link must contain party code');
  });

  test('F08-H3: Secondary listener joins existing room via 6-character code', async () => {
    // 1. Create a room
    const hostRes = await fetch(`${BASE_URL}/api/jam/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'Synced Party',
        userName: 'HostUser'
      })
    });
    const hostData = await hostRes.json() as any;
    const roomCode = hostData.room.code;

    // 2. Join room with space or lowercase (testing normalizer)
    const joinRes = await fetch(`${BASE_URL}/api/jam/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: ` ${roomCode.toLowerCase()} `,
        userName: 'GuestListener'
      })
    });

    assert.strictEqual(joinRes.status, 200);
    const joinData = await joinRes.json() as any;
    assert.strictEqual(joinData.member.isHost, false);
    assert.strictEqual(joinData.room.members.length, 2, 'Room should now have 2 members');
  });

  test('F08-H4: Host updates playback state and synchronized time propagates', async () => {
    // 1. Create room
    const hostRes = await fetch(`${BASE_URL}/api/jam/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'Sync Test Room',
        userName: 'SyncHost'
      })
    });
    const hostData = await hostRes.json() as any;
    const roomCode = hostData.room.code;
    const hostId = hostData.member.id;

    // 2. Sync playback
    const syncRes = await fetch(`${BASE_URL}/api/jam/room/${roomCode}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: hostId,
        action: 'play',
        currentTimeSec: 65,
        isPlaying: true
      })
    });

    assert.strictEqual(syncRes.status, 200);
    const syncData = await syncRes.json() as any;
    assert.strictEqual(syncData.room.currentTimeSec, 65);
    assert.strictEqual(syncData.room.isPlaying, true);

    // 3. Inspect room state
    const stateRes = await fetch(`${BASE_URL}/api/jam/room/${roomCode}`);
    assert.strictEqual(stateRes.status, 200);
    const stateData = await stateRes.json() as any;
    assert.ok(stateData.estimatedTimeSec >= 65, 'Estimated time must be at least 65s');
  });

  test('F08-H5: Non-host member control is blocked when host-only control is enabled', async () => {
    // 1. Create room with host-only control
    const hostRes = await fetch(`${BASE_URL}/api/jam/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'Strict Room',
        userName: 'Admin',
        hostOnlyControl: true
      })
    });
    const hostData = await hostRes.json() as any;
    const roomCode = hostData.room.code;

    // 2. Guest joins
    const joinRes = await fetch(`${BASE_URL}/api/jam/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: roomCode,
        userName: 'Guest'
      })
    });
    const joinData = await joinRes.json() as any;
    const guestId = joinData.member.id;

    // 3. Guest attempts to seek/pause
    const guestSyncRes = await fetch(`${BASE_URL}/api/jam/room/${roomCode}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: guestId,
        action: 'pause',
        isPlaying: false
      })
    });

    assert.strictEqual(guestSyncRes.status, 403, 'Guest attempt must be rejected with 403 Forbidden');
  });

  test('F08-H6: Member leaves room and room handles host migration or cleanup', async () => {
    // 1. Create room
    const hostRes = await fetch(`${BASE_URL}/api/jam/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: 'Ephemeral Room',
        userName: 'LoneHost'
      })
    });
    const hostData = await hostRes.json() as any;
    const roomCode = hostData.room.code;
    const hostId = hostData.member.id;

    // 2. Lone host leaves -> room should be deleted
    const leaveRes = await fetch(`${BASE_URL}/api/jam/room/${roomCode}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: hostId })
    });
    assert.strictEqual(leaveRes.status, 200);

    // 3. Checking room should now return 404
    const checkRes = await fetch(`${BASE_URL}/api/jam/room/${roomCode}`);
    assert.strictEqual(checkRes.status, 404, 'Empty room must be removed from ledger');
  });
});
