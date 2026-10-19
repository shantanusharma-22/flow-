# Flow — Landing Page Specification (Web, Mac App Store & Microsoft Store)

Copy, section layout, and messaging for the official **Flow** web presence at `https://getflow.audio/`, covering instant in-browser playback, the Progressive Web App (PWA), the **Microsoft Store**, and the **Mac App Store**.

---

## 1. Hero Section

- **Badge / Eyebrow:** `🌐 100% FREE ON WEB • MICROSOFT STORE • MAC APP STORE`
- **Headline:** Stream effortlessly. Sing along in any language.
- **Subheadline:** The fluid desktop and web music player with zero-login local playlists, real-time Romanized lyrics, and granular offline control that respects your local disk. 100% free everywhere.
- **Action CTAs:**
  1. `Launch Web Player (Instant)` → Opens the web streaming engine in browser with zero install or login.
  2. `Get it on Microsoft Store` → Direct link to Windows 10/11 native package.
  3. `Download on the Mac App Store` → Direct link to macOS universal binary.
  4. `Direct Downloads` → Portable Windows `.exe`, macOS `.dmg`, Linux `.AppImage`.
- **Sub-CTA Reassurance:** *Zero install required • Zero audio ads • Zero subscriptions • Zero telemetry.*
- **Hero Mockup Visual:** Dark obsidian glass stage showing live bilingual lyrics with phonetic Romaji toggle, lossless FLAC stream indicator, and persistent player dock.

---

## 2. Web & Desktop Platform Capabilities

### ⚡ Instant Browser Playback (Zero Install)
Open Flow directly in Google Chrome, Microsoft Edge, Apple Safari, or Mozilla Firefox. Search millions of songs and listen immediately with zero software installations, zero plugin downloads, and zero mandatory cloud logins.

### 📱 Installable Progressive Web App (PWA)
Click the install button in the browser address bar to install Flow as a native desktop or mobile app. Runs in an isolated, borderless window with independent app switching and dock pin capability.

### 🎧 Web Media Session API
Full integration with operating system media controls: hardware keyboard media keys (Play, Pause, Skip, Prev), Bluetooth headphone controls, and lockscreen now-playing widgets with synchronized track metadata and album artwork.

### 📁 Client-Side IndexedDB Storage
Local playlists and cached audio segments are stored directly in your browser's persistent client-side storage. Your listening library never gets uploaded to third-party ad networks or tracking servers.

---

## 3. How It Works (The 3-Step Flow)

```
[ Step 1: Discover ]           [ Step 2: Immerse ]             [ Step 3: Own ]
Instant zero-login search   ->  Gapless streaming &       ->    Save local playlists,
across songs and albums.        synced bilingual lyrics.        export .lrc & keep control.
```

1. **Discover Freely:** Enter any song title, artist, or album. No account creation required. No tracking cookies following you around the web.
2. **Listen in Flow:** Enjoy ultra-low latency dual-buffer streaming, dynamic ambient album bloom, and syllable-synchronized lyrics with instant Romaji/Hangul transliteration.
3. **Stay in Control:** Build custom local playlists, export `.lrc` timestamped lyrics directly to your hard drive, and selectively delete cached songs down to the megabyte.

---

## 4. Key Differentiators (Built from Real Listening Needs)

### 🔤 Phonetic Romanization & Dual-Line Lyrics (Fix #364 & #439)
Sing along to Japanese, Korean, and non-Latin tracks effortlessly. Toggle instant Romaji/Hangul romanization and side-by-side English translations with synchronized syllable highlights.

### 💾 1-Click `.lrc` Timestamped Lyrics Export (Fix #909)
Export perfectly timed `.lrc` lyric files directly to your local drive with a single click. Take your favorite lyrics to your car stereo, offline MP3 DAP, or media center.

### 📁 Zero-Login Local Playlists & `.m3u8` Export (Fix #904)
Create, reorder, and curate as many custom playlists as you want without signing in. Export your entire library to standard `.m3u8` format anytime.

### ⚡ Resilient Dual-Buffer Audio Engine (Fix #903)
Zero stutter during bitrate transitions. External browser authentication ensures you never suffer from crashed internal webviews or frozen OAuth screens.

### 🧹 Granular Cache Manager (Fix #899)
See exactly how much disk space each track occupies. Prune individual tracks with one click or set hard storage caps—never be forced to wipe your entire library again.

### 🔂 Dedicated Repeat-One & Tempo Controls (Fix #900 & #890)
Loop your current favorite track with a dedicated 3-state repeat button (Off / All / One) and fine-tune playback speed from 0.5x to 2.0x with preserved pitch.

---

## 5. Universal 100% Free Comparison

*100% free across all web and desktop platforms. No paywalls, no tiers.*

| Capability | Official Web App (`getflow.audio`) | Microsoft Store (Windows 10/11) | Mac App Store (macOS 12+) |
| :--- | :---: | :---: | :---: |
| Price | **Free ($0.00)** | **Free ($0.00)** | **Free ($0.00)** |
| Installation Required | 🚫 None (Instant) | ✅ 1-Click MSIX | ✅ 1-Click Mac App |
| Unlimited Streaming | ✅ | ✅ | ✅ |
| Synchronized Lyrics & Romaji | ✅ | ✅ | ✅ |
| Zero-Login Local Playlists | ✅ (IndexedDB) | ✅ (SQLite) | ✅ (SQLite) |
| 1-Click .lrc Lyrics Export | ✅ (Browser Download) | ✅ (Local File) | ✅ (Local File) |
| 1-Click .m3u8 Playlist Export | ✅ (Browser Download) | ✅ (Local File) | ✅ (Local File) |
| Granular Cache Pruner | ✅ (Browser Storage) | ✅ (Local Disk) | ✅ (Local Disk) |
| OS Media Keys Integration | ✅ (Media Session API) | ✅ (Windows SMTC) | ✅ (macOS Now Playing) |
| Offline Listening Mode | ✅ (PWA Cache) | ✅ (Local Cache) | ✅ (Local Cache) |
| Audio Ads or Tracking | 🚫 None | 🚫 None | 🚫 None |

---

## 6. Frequently Asked Questions

### Can I use Flow directly in my web browser without installing anything?
Yes! Flow is a full Progressive Web App (PWA). You can launch the Web Player immediately on Chrome, Safari, Edge, or Firefox. All features—including synchronized lyrics, Romaji transliteration, and local playlists—work directly in your browser without requiring an install or sign-in.

### Is Flow really 100% free on the Website, Microsoft Store, and Mac App Store?
Yes! Flow is 100% free ($0.00) across all platforms: the official website, the Microsoft Store, and the Mac App Store. There are no subscriptions, no in-app purchases, and no advertisements.

### Does the web version support media keys and keyboard shortcuts?
Yes. Flow integrates natively with the browser Media Session API. You can play, pause, seek, and skip using your physical keyboard media keys, headphone controls, and OS notification popups.

### Can I import my existing Spotify or YouTube Music playlists on the web?
Yes. The web app includes our 1-click importer that accepts public playlist links or standard .m3u8 files, saving them into your browser’s secure local storage without needing your account credentials.

### Does the web version support offline listening?
Yes! When installed as a PWA, Flow leverages client-side storage to cache downloaded audio files and timestamped lyrics so you can keep listening even during network drops.

### How does the Romanized lyrics transliteration work?
When playing tracks in Japanese, Korean, or Mandarin, Flow automatically computes phonetic Latin transcriptions (Romaji, Hangul, Pinyin) so you can sing along in real time even if you cannot read the native characters.

---

## 7. Final Call to Action

- **Headline:** Ready to get into the flow?
- **Subheadline:** Launch in your browser right now or install from the Microsoft Store or Mac App Store.
- **Button:** `Launch Flow Web Player Now`
- **Footer:** © 2026 Flow Audio • 100% Free & Open Web & Desktop Music Player • GitHub • Release Notes • Privacy Promise
