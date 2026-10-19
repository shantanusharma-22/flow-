<div align="center">

# 🎵 Flow — Hi-Res Lossless Desktop Music Player

**Next-generation, local-first music streaming player with studio-master lossless audio, Apple-style synchronized lyrics, 8-band parametric EQ, and background local directory auto-indexing.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933.svg?logo=node.js)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Native%20Local-003b57.svg?logo=sqlite)](https://www.sqlite.org/)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-45%2F45%20Passing-brightgreen.svg)]()
[![Parity Score](https://img.shields.io/badge/Parity%20Score-100.0%20%2F%20100-success.svg)]()

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Native Desktop Bundle](#-native-desktop-bundle) • [API & Tests](#-automated-testing) • [Credits](#-open-source-credits)

---

</div>

## 🌟 Highlights

- **Lossless Audio Pipeline**: Bit-perfect playback with FLAC (24-bit/1411 kbps) and high-density Opus (320 kbps), gapless crossfade (0–12s), and pitch-preserving variable speed ($0.5\times$–$2.0\times$).
- **Apple-Inspired Lyrics**: Word/syllable-level synchronized lyrics animation, dynamic phonetic Romanization (Romaji & Hangul), dual-line English translations, and 1-click `.lrc` timestamped file export.
- **8-Band Parametric Equalizer**: Hardware-accelerated Web Audio `BiquadFilterNode` cascade with acoustic signature presets (*Flat*, *Bass Boost*, *Vocal Clarity*, *Electronic*, *Rock*, *Classical*, *Acoustic*).
- **Sleep Timer & 30s Fadeout Curve**: Dock-accessible sleep timer with custom presets (15m, 30m, 45m, 60m, End of Track) featuring smooth linear volume attenuation over the final 30 seconds.
- **Continuous Local Music Watcher**: Automated background file-system watcher (`fs.watch`) continuously monitoring your local music folder (`C:\Users\shant\Music`) to auto-index newly downloaded `.flac`, `.mp3`, `.wav`, `.m4a` files directly into SQLite.
- **Spotify URI & Playlist Parser**: Paste any public Spotify playlist link or URI into Search to instantly resolve track metadata and stream high-resolution audio.
- **Granular Storage & Cache Pruning**: Per-track disk cache inspection with single-track eviction buttons, preventing hard-drive bloat without forcing a full database wipe.
- **Privacy & Local-First**: Create and organize custom playlists, edit queues, and listen completely offline without mandatory Google or cloud account sign-ins.
- **Desktop Integrations**: Discord Rich Presence listening status, external system browser OAuth (prevents embedded WebView crashes), and scrobbling to Last.fm & ListenBrainz.

---

## 🚀 Key Features

### 1. Audio Processing & Playback Engine
- **Hi-Res Formats**: Dynamic module source streaming with FLAC 24-bit/1411 kbps and Opus 320 kbps VBR fallback.
- **Gapless Crossfade**: Configurable 0 to 12-second linear acoustic transitions between consecutive tracks.
- **Pitch-Preserved Speed Control**: Fine-tuned playback speeds ($0.5\times$, $0.75\times$, $1.0\times$, $1.25\times$, $1.5\times$, $2.0\times$) using Web Audio pitch preservation (`preservesPitch = true`).
- **3-State Loop**: Cycle seamlessly between `Loop Off`, `Loop All`, and `Repeat One Track` with active dock visual badges.
- **Stats for Nerds Telemetry**: Live audio diagnostics displaying active codec, bit depth, sample rate, bitrate, buffer health, latency, peak dBFS, and stereo master bus output.

### 2. Apple-Style Synchronized Lyrics Engine
- **Fluid Syllable Highlighting**: Character-accurate fluid line tracking powered by millisecond timestamps.
- **Phonetic Romanization**: Automatic transliteration for Asian character sets (Japanese Romaji, Korean Hangul) rendered cleanly underneath original text.
- **Dual-Line Translation**: Dynamic English translations for international music catalogs.
- **Export to `.lrc`**: 1-click download of timestamped `[mm:ss.xx]` lyrics files for Digital Audio Players (DAPs) and car stereos.

### 3. Parametric Equalizer & Presets
- 8 frequency bands: **60 Hz** (Sub-Bass), **170 Hz** (Bass), **310 Hz** (Low-Mid), **600 Hz** (Mid), **1 kHz** (Mid-High), **3 kHz** (Presence), **6 kHz** (Crisp), and **12 kHz** (Treble).
- Real-time interactive vertical decibel sliders ($\pm 12\text{ dB}$) with instantaneous bypass toggle and preset chips.

### 4. Background Local Library Watcher
- Watches `C:\Users\shant\Music` using native OS directory events with debounced parsing.
- Automatically creates clean metadata entries (artist, title, bitrate, format, local file URI) into the embedded SQLite database.
- Telemetry endpoint: `GET /api/library/watcher`.

### 5. Spotify Link Resolver
- Recognizes links in Search:
  - `https://open.spotify.com/playlist/...`
  - `https://open.spotify.com/track/...`
  - `spotify:playlist:...`
- Displays a prominent status banner and automatically matches metadata to high-resolution streams.

---

## 🏗️ Architecture

```
flow/
├── e2e/                           # 45 Automated end-to-end integration tests
│   ├── a11y-responsive.test.ts    # WCAG AA contrast & ARIA role verifications
│   ├── f01-playback.test.ts       # JIT audio streaming & speed controls
│   ├── f02-lyrics.test.ts         # Millisecond timestamps, Romanization & LRC
│   ├── f03-playlists-queue.test.ts# Zero-login playlists & M3U8 export
│   ├── f04-cache-downloads.test.ts# Granular cache eviction
│   ├── f05-integrations.test.ts   # OAuth loopback & Discord Rich Presence
│   ├── f06-frontend-backend.test.ts# End-to-end full working integration
│   └── f07-advanced-features.test.ts# Equalizer, Sleep Timer, Watcher & Spotify
├── replica/                       # Reverse engineering audit & parity metrics
│   ├── features.csv               # 19 weighted feature specifications
│   ├── feedback.md                # Real community pain points from user reviews
│   ├── fixes.md                   # Resolved upstream issues (#904, #909, #364, etc.)
│   └── parity.md                  # 100.0 / 100 Parity verification report
├── server/                        # Express + SQLite backend API (Port 8901)
│   ├── db/                        # SQLite schema migrations & seeds
│   ├── routes/                    # Catalog, tracks, lyrics, library, auth
│   │   └── library.ts             # Music directory watcher & Spotify parser
│   ├── app.ts                     # Express middleware & routes
│   └── index.ts                   # Server bootstrap & background worker
├── src/                           # React 19 Frontend
│   ├── components/                # Glassmorphic UI components
│   │   ├── EqualizerModal.tsx     # 8-Band Parametric Equalizer modal
│   │   ├── SleepTimerModal.tsx    # Sleep Timer modal with 30s fadeout
│   │   ├── StatsForNerdsModal.tsx # Audio telemetry modal
│   │   ├── CreditsModal.tsx       # Open-source attributions
│   │   ├── PlayerBar.tsx          # Dock controls & quick access buttons
│   │   └── LyricsOverlay.tsx      # Apple-like word-synced lyrics view
│   ├── screens/                   # Search, Library, Settings, Artist screens
│   ├── services/                  # Web Audio player engine & API client
│   │   ├── audioPlayer.ts         # BiquadFilterNode EQ, crossfade & fadeout
│   │   └── api.ts                 # Full working backend API client
│   └── App.tsx                    # Root application component
├── src-tauri/                     # Tauri v2 native desktop bundle configuration
│   ├── Cargo.toml                 # Rust dependencies & bundle configuration
│   ├── tauri.conf.json            # Desktop windowing, security & bundle metadata
│   └── src/main.rs                # Native Tauri desktop entrypoint
├── Flow.exe                       # Standalone native 64-bit Windows executable
├── Flow-Setup.bat                 # One-click Windows installer script
├── FlowLauncher.cs                # Native C# single-instance process supervisor
└── package.json                   # Dependencies & npm scripts
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.0.0 or higher
- **OS**: Windows 10/11, macOS, or Linux

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shantanusharma-22/flow-.git
   cd flow-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local backend API server**:
   ```bash
   npm run server
   ```
   *The backend starts at `http://127.0.0.1:8901`, verifies schema migrations, seeds the catalog, and attaches the background file-system watcher to `C:\Users\shant\Music`.*

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   *The UI will be available at `http://localhost:5173`.*

---

## 📦 Native Desktop Bundle

Flow offers two native Windows desktop options:

### Option A: Standalone Windows Executable (Ready to Run)
No Rust or Cargo compilation needed! Run Flow directly on Windows:
```bash
# One-click setup (creates Desktop & Start Menu shortcuts, then launches Flow)
.\Flow-Setup.bat

# Or double-click the native executable directly
.\Flow.exe
```

### Option B: Build via Tauri
If you have Rust and Cargo installed:
```bash
npm run build
cargo tauri build
```
*Produces a standalone MSI and NSIS installer in `src-tauri/target/release/bundle/`.*

---

## 🧪 Automated Testing

Flow comes with a comprehensive suite of 45 automated end-to-end tests validating accessibility, Web Audio behavior, SQLite persistence, and API contracts:

```bash
npm run test:e2e
```

**Test Coverage Summary**:
- `A11Y & Responsive`: WCAG AA contrast (4.5:1 text, 3:1 UI), ARIA roles.
- `F01 Playback`: JIT stream resolution, validation errors, pitch-preserved speed control.
- `F02 Lyrics`: Millisecond timestamps, Romanization transliteration, standard `.lrc` export.
- `F03 Playlists`: Zero-login local playlists, `.m3u8` export, queue reordering.
- `F04 Cache`: Granular per-track inspection and single-track eviction.
- `F05 Integrations`: External OAuth loopback, scrobbling threshold, Discord RPC.
- `F06 Integration`: Frontend preview bundle, SQLite persistence, and live search.
- `F07 Advanced`: Equalizer frequency curve presets, sleep timer linear fadeout ratio, directory watcher status, and Spotify URI parsing.

---

## 🎯 Feature Parity Matrix

Flow was engineered using clean-room specifications under `/replica-diff` to match and surpass existing desktop players:

| Feature Area | Parity Status | Key Enhancement over Legacy Players |
|---|:---:|---|
| **Audio Quality** | **100%** | FLAC 24-bit lossless + Opus 320kbps fallback |
| **Equalizer** | **100%** | 8-band Web Audio parametric EQ with 7 sound curves |
| **Sleep Timer** | **100%** | 30-second linear acoustic volume fadeout curve |
| **Lyrics** | **100%** | Syllable-sync, Asian Romanization, and `.lrc` download |
| **Playlists** | **100%** | Local-first, zero login required (Fixes #904) |
| **Directory Watcher** | **100%** | Auto-indexes local folder (`C:\Users\shant\Music`) |
| **Spotify Mapping** | **100%** | Automatic URI & playlist conversion in Search |
| **Cache Management**| **100%** | Granular single-track eviction (Fixes #899) |
| **Desktop Bundle** | **100%** | Native Windows `Flow.exe` + Tauri v2 configuration |

*Overall Parity Score: **100.0 / 100** (Verified via `parity.py replica/features.csv`).*

---

## 💖 Open-Source Credits

Flow is built with gratitude to the open-source community:
- **Apple-Style Lyrics Animation**: Inspired by [`binimum/am-lyrics`](https://github.com/binimum/am-lyrics).
- **Lyrics Providers & API Communities**:
  - [LRCLIB](https://lrclib.net/)
  - [lrc.red](https://lrc.red/)
  - [BiniLyrics](https://github.com/binimum)
  - [BetterLyrics](https://github.com/better-lyrics/better-lyrics)
  - [PaxSenix](https://lyrics.paxsenix.org/)
  - [LyricsPlus](https://github.com/ibratabian17/YouLyPlus)
  - [SimpMusic](https://github.com/maxrave-dev/SimpMusic)
  - [Unison](https://unison.boidu.dev/)
  - [Megalobiz](https://www.megalobiz.com/)
  - [KuGou](https://www.kugou.com/)
  - [Musixmatch](https://www.musixmatch.com/)
  - [Genius](https://genius.com/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for educational, personal, and research purposes.
