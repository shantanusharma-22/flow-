# Recon map: BitChord (Desktop - Windows / Cross-platform)

Scope: Core music streaming, search, Apple Music-inspired player, synchronized lyrics, and playlist/queue management
For: Desktop music streaming enthusiast (personal client / open alternative product)
Date: 2026-10-19

## Sources

| # | source | URL / Location | notes |
| --- | --- | --- | --- |
| 1 | Local Installed PC App | `C:\Users\shant\AppData\Local\BitChord\BitChord.exe` | Inspected runtime config `BitChord.cfg`, Compose Multiplatform architecture, JavaFX Media & Skiko stack |
| 2 | Official GitHub Repository | `https://github.com/kushagrasinghx/BitChord` | Full public feature catalog, screenshots, dependencies, and releases |
| 3 | Public Landing Page | `https://bitchord.kushagrasingh.in` | Official product positioning, feature highlights, and platform coverage |
| 4 | Public Backend Endpoint | `https://api.bitchord.kushagrasingh.in/` | Server endpoints for live stats and Listen Together shared session architecture |
| 5 | Public Module Index | `https://tidalhifihidesuosate.cyrusna29.workers.dev/8spine-source.json` | Remote audio stream & module configuration index |

## Core loop

Search, browse, and stream any track from YouTube Music with Apple Music-inspired visual polish, animated synchronized lyrics, and local queue management without ads or subscription fees.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Home / Discover | `/` or Sidebar "Home" | Discover trending songs, quick picks, mood chips, and recent playlists | Hero banner carousel, horizontal media card carousel, mood chips (Relax, Focus, Workout), track rows | loading skeleton, populated feed, offline retry |
| S02 | Search & Results | `/search` or Top search bar | Search entire catalog across songs, albums, artists, and playlists | Search input with clear button, recent search history chips, filter tab bar (Songs, Albums, Artists, Playlists), track result list with duration & context menu | empty prompt, typing autocomplete, results loaded, no results |
| S03 | Now Playing (Expanded Player) | Bottom Player Bar click / Fullscreen toggle | Immersive playback view with ambient background glow and full controls | Dynamic blurred artwork canvas, title/artist links, interactive scrub progress bar, time elapsed/remaining, controls (Shuffle, Prev, Play/Pause, Next, Repeat), volume slider, lyrics/queue toggles | buffering/spinner, playing, paused, scrubbing preview, audio error |
| S04 | Synchronized Lyrics | S03 Lyrics button or split-view | Apple Music-style smooth animated line/character synchronized lyrics | Vertical auto-scrolling lyrics column, glowing active lyric line zoom, click-to-seek lyrics line, instrumental break dots | lyrics loading, synced lyrics active, plain unsynced fallback, no lyrics |
| S05 | Player Queue / Up Next | S03 Queue button or drawer | Inspect upcoming tracks, reorder songs, toggle autoplay radio | Currently playing card, "Playing Next" reorderable list, drag-and-drop handles, remove button, clear queue, "Automix / Radio" toggle switch | queue empty, populated queue, infinite radio appended |
| S06 | Playlist & Album Detail | `/playlist/:id` or `/album/:id` | View full tracklist, metadata, duration, and batch actions | Cover art header, title, creator, release year/runtime, "Play All", "Shuffle", "Download All", searchable tracklist table | loading, populated, empty custom playlist, downloaded status |
| S07 | Artist Page | `/artist/:id` | Explore artist discography, top hits, and related artists | Hero artist backdrop, top 5 popular songs list, albums carousel, singles & EPs grid, similar artists | loading, populated, error |
| S08 | Library & Downloads | `/library` or Sidebar "Library" | Access saved liked songs, custom playlists, offline downloads, and local files | Library tab selector (Playlists, Liked, Downloads, Local Files), "Create Playlist" button, sort dropdown, local directory scan button | empty onboarding, populated library, scanning folders progress |
| S09 | Settings & Integrations | `/settings` or Sidebar gear | Configure audio playback quality, UI themes, and external integrations | Audio quality selector (Lossless, High, Normal), crossfade slider (0–12s), Discord RPC toggle, Last.fm scrobble connect, Listen Together room session, theme selector | accounts connected, disconnected, connecting spinner |

## Flows

```
F01 Search, Select, and Play
    S01 Home -> Click search -> S02 Search -> Type query -> Click song -> S03 Now Playing opens & audio streams
    happy path clicks: 3
    edge: stream URL resolution failure; fallback to alternative audio stream format

F02 Synced Lyrics Sing-Along and Seeking
    S03 Now Playing -> Click Lyrics icon -> S04 Synced Lyrics -> Click any upcoming lyric stanza -> Audio seeks directly to timestamp
    happy path clicks: 2
    edge: song lacks synced LRC; display static lyrics or show "No lyrics found" badge

F03 Playlist Curation & Queue Management
    S02 Search or S06 Album -> Click "..." context menu on track -> Select "Add to Playlist" or "Play Next" -> S05 Queue or S06 Playlist updates immediately
    happy path clicks: 2
    edge: duplicate track prompt; queue reordering during active playback

F04 Offline Track Download
    S03 Player or S06 Playlist -> Click Download icon -> Background downloader downloads audio & embeds ID3/Vorbis tags -> S08 Library > Downloads marks track as offline
    happy path clicks: 1
    edge: disk space exhausted, intermittent connection failure during chunk download

F05 Account Scrobbling and Social Status
    S09 Settings -> Connect Last.fm / Discord RPC -> Audio playback triggers live Discord status & Last.fm scrobble at 50% progress
    happy path clicks: 2
    edge: Discord desktop client not running; auth token expired
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| PlayerBar | standard, compact, minimized | playing, paused, buffering, seeking, muted | all screens (bottom dock) |
| TrackRow | standard, numbered, compact | default, hover, active/playing, selected, disabled | S01, S02, S05, S06, S07, S08 |
| MediaCard | square (album/playlist), circle (artist) | default, hover (elevate + show play button), focused | S01, S06, S07, S08 |
| ScrubBar | default, expanded on hover | default, hovering (show timestamp tooltip), scrubbing/dragging | S03, PlayerBar |
| SyncedLyricsViewer | full-screen, split-drawer | loading, active sync, static text, empty | S04 |
| SidebarNav | expanded, collapsed | default, active route, hover | S01, S02, S06, S07, S08, S09 |
| ContextMenu | track menu, playlist menu | open, closed, option hovered | S01, S02, S05, S06, S07, S08 |
| AudioEqualizer | 5-band, 10-band | flat, preset active, custom curve dragging | S03, S09 |
| ModalDialog | create playlist, scan folders, connect account | open, closed, validating, submitting | S08, S09 |

## Inferred data model

```
Track           id (string, YouTube Video ID), title (string), artists (list of ArtistRef),
                album (AlbumRef?), durationSec (int), thumbnailUrl (string), audioStreamUrl (string?),
                hasLyrics (boolean), isDownloaded (boolean), localFilePath (string?), addedAt (timestamp)
                evidence: S02 track item, S03 player state, S08 downloads list
                confidence: high

Artist          id (string), name (string), thumbnailUrl (string), description (string?),
                subscribersCount (int?), topTracks (list of Track), albums (list of Album)
                evidence: S07 artist screen, YouTube Music artist browse endpoint
                confidence: high

Album           id (string), title (string), artists (list of ArtistRef), year (int?),
                thumbnailUrl (string), trackCount (int), tracks (list of Track)
                evidence: S06 album view, album browse response
                confidence: high

Playlist        id (string), title (string), description (string?), author (string),
                isCustom (boolean), tracksCount (int), tracks (list of Track), thumbnailUrl (string?)
                evidence: S06 playlist detail, S08 library list
                confidence: high

PlaybackState   currentTrack (Track?), currentPositionMs (long), durationMs (long),
                isPlaying (boolean), isBuffering (boolean), volume (float, 0..1),
                repeatMode (enum: OFF | ALL | ONE), isShuffle (boolean), crossfadeDurationMs (int)
                evidence: S03 expanded player, PlayerBar controls
                confidence: high

Queue           id (string), currentIndex (int), tracks (list of Track), autoplayEnabled (boolean)
                evidence: S05 queue side drawer, queue reorder interactions
                confidence: high

LyricsData      trackId (string), isSynced (boolean), provider (string),
                lines (list of { startTimeMs: long, endTimeMs: long, text: string })
                evidence: S04 synchronized lyrics view, LRCLIB / YouTube captions payload
                confidence: high

UserSettings    audioQuality (enum: LOSSLESS | HIGH | NORMAL), crossfadeSeconds (int),
                theme (enum: DARK | OLED | MICA | LIGHT), discordRpcEnabled (boolean),
                lastFmSessionKey (string?), downloadDirectory (string)
                evidence: S09 settings view, BitChord.cfg java-options
                confidence: high
```

Relationships:
- `Artist` 1-n `Track`
- `Album` 1-n `Track`
- `Playlist` n-m `Track`
- `Queue` 1-n `Track`
- `Track` 1-1 `LyricsData`

## Feature matrix

See `replica/features.csv`.
- Must: 8
- Should: 6
- Could: 5
- Skip: 3

## Out of scope (cannot or should not be cloned)

- **Original Brand Assets**: The proprietary BitChord name, trademarks, and original logo assets (`Logo.png`, `Banner.png`) belong to the original author and must be replaced in any clone.
- **Official YouTube / Google DRM**: Widevine-encrypted DRM video streams and private internal Google session authorization tokens.
- **Closed Third-Party Servers**: Private servers such as `api.bitchord.kushagrasingh.in` or specific private worker reverse proxies; clone must implement its own open sync or WebRTC/WebSocket coordination.

## Size

Screens: 9, Flows: 5, Entities: 8.
Hard parts:
1. High-fidelity audio streaming and stream resolution (Innertube stream parsing + smooth audio player engine).
2. Smooth Apple Music-style animated synchronized lyrics rendering with millisecond timestamp seek mechanics.
3. Offline caching and metadata embedding with background queue persistence.

Size: **M (a few weeks)** for full production desktop parity; **S (a weekend)** for the core vertical slice (Search -> Stream -> Player Bar -> Synced Lyrics).
