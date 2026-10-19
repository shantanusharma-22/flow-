# Test Plan: Flow Desktop Music Player

Build: `3b99a81`  Date: 2026-10-19  Env: Local test environment, SQLite WAL, seed data

## Flow Coverage Matrix

| Case ID | Flow | Type | Steps | Expected Result | Automated | Result |
|---|---|---|---|---|---|---|
| **F01-H1** | F01: Search & Play | Happy | Open `/api/search?q=Synth`, select `track-01`, resolve stream `/api/tracks/track-01/stream?quality=lossless` | Returns lossless FLAC stream metadata with 1411kbps bitrate and valid audio preview URL | `e2e` | PASS |
| **F01-E1** | F01: Search & Play | Edge: Empty query | Call `/api/search?q=` | Returns HTTP 400 Bad Request with validation message | `e2e` | PASS |
| **F01-E2** | F01: Search & Play | Edge: Special characters | Search with `♪ %20 & ' " <script>` | Safely sanitized, returns matching tracks or empty list without SQL injection | `e2e` | PASS |
| **F01-E3** | F01: Search & Play | Edge: Unknown track ID | Request stream for `non-existent-track-999` | Returns HTTP 404 Track stream not found | `e2e` | PASS |
| **F01-H2** | F01: Audio Controls | Happy | Cycle 3-state loop button (Off -> All -> One) (Fix #900) | Audio engine repeat mode transitions correctly from `off` to `all` to `one` | `e2e` | PASS |
| **F01-H3** | F01: Audio Controls | Happy | Adjust playback speed to 1.5x (Fix #890) | Tempo scales to 1.5x while `preservesPitch` remains true | `e2e` | PASS |
| **F02-H1** | F02: Synced Lyrics | Happy | Request lyrics for `track-01` | Returns structured array of timestamped lines `[{startTimeMs, endTimeMs, text, romanized}]` | `e2e` | PASS |
| **F02-H2** | F02: Synced Lyrics | Happy: Seek sync | Given timestamp `22000`ms, lookup active lyric stanza | Correctly identifies line 3 ("誰も知らない秘密の鼓動が") | `e2e` | PASS |
| **F02-E1** | F02: Synced Lyrics | Edge: Unsynced track | Request lyrics for track without LRC | Returns `isSynced: false` and empty lines array gracefully | `e2e` | PASS |
| **F02-H3** | F02: Transliteration | Happy: Romanize | Call `/api/lyrics/romanize` with Japanese stanzas (Fix #364) | Generates phonetic Romaji subline and dual-line English translation | `e2e` | PASS |
| **F02-H4** | F02: Export LRC | Happy: Save LRC | Call `/api/lyrics/export-lrc` for `track-01` (Fix #909) | Returns standard `.lrc` formatted file with `[mm:ss.xx]` tags | `e2e` | PASS |
| **F03-H1** | F03: Zero-Login Playlist | Happy | Create local playlist `Synthwave Chill` (Fix #904) | Creates playlist record in SQLite with `is_custom: 1` and `source: 'local'` without requiring cloud login | `e2e` | PASS |
| **F03-E1** | F03: Zero-Login Playlist | Edge: Empty title | POST `/api/playlists` with `{ title: "" }` | Fails with HTTP 400 Bad Request validation error | `e2e` | PASS |
| **F03-H2** | F03: Playlist Tracks | Happy | Add `track-01` to playlist and fetch playlist detail | Playlist track count increments, track row appears in ordered table | `e2e` | PASS |
| **F03-H3** | F03: M3U8 Export | Happy | Export playlist `playlist-01` to `.m3u8` | Returns valid `#EXTM3U` and `#EXTINF` standard playlist text | `e2e` | PASS |
| **F03-H4** | F03: Queue Reordering | Happy | Reorder playback queue positions | Queue updates positions in SQLite, subsequent `GET /api/queue` reflects new order | `e2e` | PASS |
| **F04-H1** | F04: Offline Storage | Happy | Mark `track-02` as downloaded | Track flagged `is_downloaded = 1`, appears in Downloads library tab | `e2e` | PASS |
| **F04-H2** | F04: Granular Cache | Happy: Inspect | Query `/api/cache` (Fix #899) | Returns per-track disk usage in MB and total cache allocated | `e2e` | PASS |
| **F04-H3** | F04: Granular Cache | Happy: Evict | DELETE `/api/cache/track-03` (Fix #899) | Evicts only `track-03` from disk cache; remaining cached songs stay intact | `e2e` | PASS |
| **F05-H1** | F05: External OAuth | Happy | Request OAuth URL for Spotify (Fix #903) | Returns system browser authorization URL pointing to loopback receiver `127.0.0.1:8901` without crashing WebViews | `e2e` | PASS |
| **F05-H2** | F05: Scrobbling | Happy | Emit scrobble at 60% playback | Updates play count in SQLite and registers Last.fm scrobble event | `e2e` | PASS |
| **F05-E1** | F05: Scrobbling | Negative: Early skip | Emit scrobble at 30% playback | Returns `scrobbled: false` (under 50% threshold) | `e2e` | PASS |
| **F05-H3** | F05: Discord RPC | Happy | POST live playing status to `/api/integrations/discord-rpc` | Emits Rich Presence activity payload (`Listening to ...`) | `e2e` | PASS |
| **A11Y-H1**| Accessibility | Happy | Inspect ARIA roles across components | PlayerBar role `region`, ScrubBar role `slider`, Modal role `dialog` verified | `e2e` | PASS |
| **A11Y-H2**| Design System Contrast | Happy | Verify WCAG AA contrast ratio | All 9 token pairs meet or exceed 4.5:1 text and 3.0:1 UI boundaries | `e2e` | PASS |