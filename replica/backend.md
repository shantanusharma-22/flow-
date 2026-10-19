# Backend Architecture & Service Specifications: Flow Desktop Player

Rebuilt clean-room from `replica/architecture.md`, `replica/schema.sql`, and `replica/fixes.md`.
All backend code is implemented using Node.js v24 native SQLite (`node:sqlite`), Express 5, TypeScript (`tsx`), and Zod validation.

---

## 1. System Overview

```
                      +------------------------------------------+
                      |         Flow Desktop Frontend Client     |
                      |          (React 19 / Tauri Shell)        |
                      +--------------------+---------------------+
                                           | HTTP / REST (port 8901)
                                           v
+----------------------------------------------------------------------------------------+
|                               Flow Desktop Backend Service                             |
|                                                                                        |
|  [Security & RateLimit]       [Validation]             [Auth / Session]                |
|  - CORS allowed origins       - Zod schema validation  - Zero-login local device owner |
|  - Sliding-window throttler   - Structured error format- Fix #903: External loopback   |
|                                                                                        |
|  [API Routes]                                                                          |
|  ├── /api/auth          -> Loopback OAuth & GDPR wipe                                  |
|  ├── /api/search        -> Catalog query proxy with debouncing                         |
|  ├── /api/tracks        -> JIT audio stream resolver (lossless/high/normal)            |
|  ├── /api/lyrics        -> Synced lyrics, Romaji Romanization (#364), LRC export (#909)|
|  ├── /api/playlists     -> Zero-login custom playlist CRUD (#904), M3U8 export/import  |
|  ├── /api/queue         -> Playback queue persistence & reordering                     |
|  ├── /api/cache         -> Granular single-track cache manager (#899)                  |
|  ├── /api/settings      -> User preferences key-value store                            |
|  └── /api/integrations  -> Last.fm scrobbler, Discord Rich Presence, Listen Together   |
|                                                                                        |
|  [Database Engine]                                                                     |
|  - Native SQLite 3 (node:sqlite) in WAL mode (`PRAGMA journal_mode = WAL;`)           |
|  - Foreign key integrity enabled (`PRAGMA foreign_keys = ON;`)                         |
|  - 8 normalized tables from schema.sql                                                 |
+----------------------------------------------------------------------------------------+
```

---

## 2. Differentiators & Bug Fixes Resolved

| Issue / Feature | Backend Implementation | Endpoints |
|---|---|---|
| **Fix #903: WebView Crash Prevention** | Spawns external system default browser for Spotify & Google OAuth via loopback receiver (`http://127.0.0.1:8901/api/auth/callback/:provider`). Eliminates embedded WebView crashes on custom OS builds. | `GET /api/auth/external-oauth`<br>`GET /api/auth/callback/:provider` |
| **Fix #904: Zero-Login Local Playlists** | Fully decoupled from cloud accounts. Custom playlists and tracks persist directly in local SQLite and support standard `.m3u8` export and import. | `POST /api/playlists`<br>`GET /api/playlists/:id/export-m3u` |
| **Fix #364 & #439: Phonetic Romanization** | Offline transliteration pipeline generates Romaji and Hangul phonetic sublines with dual-line English translations. | `POST /api/lyrics/romanize` |
| **Fix #909: LRC Lyrics Exporter** | Standard timestamped `.lrc` file generator formatted with `[mm:ss.xx]` tags for car audio and DAP players. | `POST /api/lyrics/export-lrc` |
| **Fix #899: Granular Cache Manager** | Inspect disk cache usage per track (size in MB and date), with single-click per-track eviction rather than wiping the entire cache. | `GET /api/cache`<br>`DELETE /api/cache/:id` |
| **Fix #900 & #890: 3-State Loop & Tempo** | Backend stream resolution accommodates custom playback speeds ($0.5\times$ to $2.0\times$) and repeat modes (`off`, `all`, `one`). | `GET /api/tracks/:id/stream` |

---

## 3. Database & Migrations

- **Database Engine**: Embedded SQLite 3 via Node.js native `DatabaseSync` (`node:sqlite`).
- **Location**: `./data/flow.db`.
- **Migration Script**: `server/db/migrate.ts` reads and executes [`replica/schema.sql`](file:///C:/Users/shant/.gemini/antigravity-ide/scratch/bitchord-replica/replica/schema.sql).
- **Seed Script**: `server/db/seed.ts` loads initial artists, albums, tracks with stream URLs, synced lyrics, and playlists.
- **Active Tables (8)**:
  1. `artists`: Creator metadata, subscriber count, avatar.
  2. `albums`: Discography, release year, track count.
  3. `tracks`: Audio metadata, stream URL, bitrate, formats (`opus`, `aac`, `flac`), like and download flags.
  4. `playlists`: Local and imported playlists (`is_custom = 1`).
  5. `playlist_tracks`: Ordered junction table with position indexing.
  6. `lyrics`: Character and line-synced JSON timestamps, raw LRC text.
  7. `playback_queue`: Persistent queue state and autoplay flag.
  8. `user_settings`: Key-value configuration store.

---

## 4. Security Checklist

- [x] **Secrets only in env vars**: `.env*` added to `.gitignore`. No credentials hardcoded.
- [x] **Environment example provided**: [`.env.example`](file:///C:/Users/shant/.gemini/antigravity-ide/scratch/bitchord-replica/.env.example) documented with all variable names and zero values.
- [x] **Input validated on server**: Every endpoint protected by strict `zod` schemas via `server/middleware/validate.ts`.
- [x] **Authorisation checked**: Profile-scoped authorization via `server/middleware/auth.ts`.
- [x] **Rate limits active**: Sliding-window rate limiter on search and stream endpoints (`server/middleware/rateLimit.ts`).
- [x] **CORS & Security Headers**: Restricted origin policies, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.
- [x] **Dependencies audited**: `npm audit` executed with **0 vulnerabilities**.
- [x] **Privacy & Data Wipe**: Apple and GDPR-compliant wipe endpoint (`POST /api/auth/wipe-data`) deletes all local playlists and tracks.

---

## 5. Verification Log

| Test | Method / Endpoint | Result |
|---|---|---|
| Health Check | `GET /api/health` | `HTTP 200` (`status: healthy`) |
| Catalog Search | `GET /api/search?q=Synth&category=all` | Returns matched songs, artists, albums, playlists |
| Lossless Stream JIT | `GET /api/tracks/track-01/stream?quality=lossless` | `audioFormat: flac`, `bitrateKbps: 1411` |
| Synced Lyrics | `GET /api/lyrics/tracks/track-01/lyrics` | Returns millisecond line timestamps & Romaji sublines |
| Zero-Login Playlist | `POST /api/playlists` | Created playlist `local-pl-...` in SQLite |
| M3U8 Export | `GET /api/playlists/playlist-01/export-m3u` | Valid `#EXTM3U` output stream |
| Granular Cache Pruning | `DELETE /api/cache/track-03` | Evicts single track `track-03` |
| External Browser OAuth | `GET /api/auth/external-oauth?provider=spotify` | Generates loopback auth URL |
