# Architecture: BitChord Replica (Desktop Streaming Client)

A rebuild of BitChord's core streaming, lyrics synchronization, and playlist functionality, re-engineered for desktop-native performance, responsive HiDPI windowing, and zero-login local playlists.

---

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| **Desktop Shell** | **Tauri 2.0 (Rust runtime)** | Lightweight native binary (<20MB, <80MB RAM vs 500MB+ for JavaFX/Electron), direct OS windowing controls (solves #884/#913 scaling bugs), and native Windows SMTC media keys. |
| **UI Framework** | **React 19 + TypeScript (Vite)** | Rapid component reactivity, declarative state handling for playback/lyrics animation, and strict typing for data models. |
| **Styling** | **Vanilla CSS + Design Tokens** | Glassmorphism, dynamic frosted ambient glow canvas, liquid pill navigation, and theme variables without heavy utility runtime overhead. |
| **Audio Engine** | **Dual-Buffer Web Audio + Rust Rodio pipeline** | Hardware-accelerated audio streaming, gapless playback, equal-power crossfade (0–12s), and independent tempo/pitch shifting (0.5x–2.0x). |
| **Local Database** | **SQLite (Embedded via Tauri SQL)** | Fast, zero-configuration local-first persistence for 100,000+ tracks, custom playlists, cached lyrics, and queue history with zero cloud dependencies. |
| **ORM / Query Layer** | **Drizzle ORM (or typed SQL queries)** | Lightweight typed queries matching `replica/schema.sql` with zero runtime bloat. |
| **Stream Extraction** | **YouTube Music Innertube (`WEB_REMIX` / Android)** | Clean reverse proxy extracting audio stream manifests without official API keys or user account requirements. |
| **Lyrics Engine** | **LRCLIB API + Local Transliteration** | Character/word-synced lyrics with offline phonetic Romanization (Romaji, Hangul, Pinyin) and local `.lrc` file exporter. |
| **Authentication** | **External System Browser Loopback OAuth** | Spawns system default browser (`http://127.0.0.1:port/callback`) for Spotify/Google login, eliminating outdated embedded WebView crashes (#903). |
| **Packaging & CI** | **Tauri CLI (`cargo tauri build`)** | Automated standalone `.exe`, `.msi`, `.dmg`, and `.deb` single-file installer compilation. |

---

## 2. Schema

Tables: **8**. Access rules: **Local profile-scoped data layer checks**.
Full DDL definition is maintained in [`replica/schema.sql`](file:///C:/Users/shant/.gemini/antigravity-ide/scratch/bitchord-replica/replica/schema.sql).

### Entity Relationship Diagram

```
+---------------+           +---------------+           +---------------+
|    artists    | 1       * |    albums     | 1       * |    tracks     |
|---------------|<----------|---------------|<----------|---------------|
| id (PK)       |           | id (PK)       |           | id (PK)       |
| name          |           | title         |           | title         |
| thumbnail_url |           | artist_id(FK) |           | artist_id(FK) |
+---------------+           +---------------+           | album_id (FK) |
                                                        | stream_url    |
                                                        | is_liked      |
                                                        | is_downloaded |
                                                        +-------+-------+
                                                                | 1
        +-------------------------------------------------------+
        | 1                     | 1                     | *
+-------v-------+       +-------v-------+       +-------v---------------+
|    lyrics     |       | playback_queue|       |   playlist_tracks     |
|---------------|       |---------------|       |-----------------------|
| track_id (PK) |       | position (PK) |       | playlist_id (PK, FK)  |
| is_synced     |       | track_id (FK) |       | track_id (PK, FK)     |
| synced_json   |       | is_current    |       | position (UNIQUE)     |
| raw_lrc       |       +---------------+       +-------+---------------+
+---------------+                                       | *
                                                        | 1
                                                +-------v-------+
                                                |   playlists   |
                                                |---------------|
                                                | id (PK)       |
                                                | title         |
                                                | is_custom     |
                                                | source (local)|
                                                +---------------+
```

---

## 3. API & Internal RPC Interface

Mapped directly to the user flows from `replica/recon.md` and differentiator items from `replica/fixes.md`:

| Method / Command | Does | Who | Input | Output | Flow / Feature |
| --- | --- | --- | --- | --- | --- |
| `GET /api/search` | Query YouTube Music catalog | Public | `query: string, filter?: string` | `SearchResult[]` | F01 (Search) |
| `GET /api/tracks/:id/stream` | Resolve audio playback URL & bitrate | Public | `trackId: string, quality?: string` | `{ streamUrl, format, bitrate }` | F01 (Play) |
| `GET /api/tracks/:id/lyrics` | Fetch synced LRC or line timestamps | Public | `trackId: string, title, artist` | `LyricsData` | F02 (Lyrics) |
| `POST /api/lyrics/export-lrc` | Save timestamped `.lrc` file to disk | User | `trackId: string, targetPath: string` | `{ success: boolean, path }` | Fix #909 |
| `POST /api/lyrics/romanize` | Generate phonetic Romaji/Hangul | Public | `lines: LyricLine[]` | `LyricLine[]` (with transliteration) | Fix #364 |
| `GET /api/playlists` | List local & imported playlists | User | `none` | `PlaylistSummary[]` | F03 (Library) |
| `POST /api/playlists` | Create local playlist without login | User | `{ title, description }` | `Playlist` | Fix #904 |
| `POST /api/playlists/:id/tracks` | Add track to playlist | User | `{ trackId, position? }` | `{ success: boolean }` | F03 |
| `DELETE /api/playlists/:id/tracks/:tId` | Remove track from playlist | User | `playlistId, trackId` | `{ success: boolean }` | F03 |
| `PUT /api/playlists/:id/reorder` | Drag-and-drop reorder playlist | User | `{ orderedTrackIds: string[] }` | `{ success: boolean }` | F03 |
| `GET /api/playlists/:id/export-m3u` | Export playlist to standard `.m3u8` | User | `playlistId: string` | `m3u8Content: string` | Differentiator |
| `GET /api/queue` | Get current active playback queue | User | `none` | `{ tracks: Track[], currentIndex }` | F01 / F03 |
| `POST /api/queue/add` | Append track or "Play Next" | User | `{ trackId, playNext: boolean }` | `QueueState` | F03 |
| `PUT /api/queue/reorder` | Reorder queue items | User | `{ fromIndex, toIndex }` | `QueueState` | F03 |
| `POST /api/tracks/:id/download` | Download audio + embed ID3 tags | User | `{ trackId, quality, savePath }` | `{ downloadedPath, size }` | F04 (Download) |
| `DELETE /api/cache/tracks/:id` | Selectively remove single cached song | User | `trackId: string` | `{ freedBytes: number }` | Fix #899 |
| `DELETE /api/cache/purge` | Purge entire cache | User | `none` | `{ freedBytes: number }` | F04 (Settings) |
| `POST /api/integrations/browser-oauth` | Launch external browser OAuth loop | User | `{ provider: 'spotify' \| 'google' }` | `{ authToken, profile }` | Fix #903 |

### Background Tasks & Daemons
1. **Stream Manifest Keepalive**: Checks playing stream expiration (<60s remaining) and silently pre-fetches next URL segment.
2. **Audio Cache Quota Pruner**: Runs on startup to verify cache size remains within user-configured disk limits (LRU eviction).
3. **Discord RPC Heartbeat**: Emits playback status update every 15 seconds to local `\\pipe\\discord-rpc`.

---

## 4. The Parts That Bite

1. **Audio Stream URL Expiration**:
   YouTube Music audio streams contain an `expire=<timestamp>` parameter (typically ~6 hours validity). The player must never store hardcoded stream URLs permanently in the database. Only track IDs and metadata are persisted; streams are resolved just-in-time and renewed transparently on track loop.
2. **HiDPI Scaling and Stage Constraints (Fixes #884 & #913)**:
   Never apply hardcoded minimum stage pixel dimensions (`minWidth: 1200, minHeight: 800`). Use a responsive fluid container with a safe minimum bound (`minWidth: 720px, minHeight: 480px`) and integrate with native OS window state listeners so maximizing enters true full-screen mode on macOS and fills work areas cleanly on Windows/Linux.
3. **Concurrent Autoplay Deduplication**:
   When AutoPlay radio is enabled, rapid song skipping can trigger multiple concurrent recommendation fetches that append duplicate tracks. The queue builder must hold an async mutex lock and filter incoming candidate songs against both the active queue and recent play history.
4. **Millisecond-Accurate Lyric Sync during Crossfade**:
   Crossfading between two audio streams creates an overlap period where two timestamps coexist. The UI must bind the active synchronized lyric line exclusively to the primary fading-in player to avoid visual flickering.
5. **Rate Limiting on Reverse Stream Extractors**:
   Direct YouTube requests can be throttled if burst queries occur during fast scrolling. The application must batch search autocompletes with a 250ms debounce and cycle user-agent personas between Web and Android Innertube clients.

---

## 5. Build Order

```
Milestone 1: Vertical Slice (S01, S02, S03, S04)
    ├── Search YouTube catalog -> Stream audio playback -> Bottom player dock -> Synced lyrics
    └── Proves: Tauri audio pipeline, Innertube resolution, and LRCLIB timestamp rendering.

Milestone 2: Must-Haves & Parity (S05, S06, S08)
    ├── Local playlist CRUD without login (Fixes #904)
    ├── Reorderable queue drawer with deduplicated autoplay
    ├── 3-state loop button (Off -> All -> One) & playback speed controls (0.5x–2.0x)
    └── Native Windows Media Transport Controls (SMTC) & keyboard shortcuts

Milestone 3: Should-Haves & Refinements (S07, S09)
    ├── Granular cache manager with single-track deletion (Fixes #899)
    ├── Offline audio downloads with embedded ID3/Vorbis metadata & artwork
    ├── Equal-power sinusoidal crossfade (0–12s) with zero stream pauses
    └── Phonetic Romanization & dual-line lyric translation (Fixes #364, #439)

Milestone 4: Differentiators & Integrations
    ├── External system browser OAuth for Spotify (Fixes #903)
    ├── Standard M3U / M3U8 local playlist file export & import
    ├── Save `.lrc` lyrics file to local disk (Fixes #909)
    └── Discord Rich Presence local IPC integration
```

---
**Next Step**: Run [`/replica-design`](file:///C:/Users/shant/.gemini/config/skills/replica-design/SKILL.md) to generate the complete design tokens (colors, typography, spacing) and component specifications.
