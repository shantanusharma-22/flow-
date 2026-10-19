# Flow — Landing Page Specification

Copy, section layout, and messaging for the official **Flow** landing page. Built in the brand voice (fluid, crisp, unobtrusive) and anchored in the primary positioning angle.

---

## 1. Hero

- **Badge / Eyebrow:** `DESKTOP-FIRST AUDIO STREAMING`
- **Headline:** Stream effortlessly. Sing along in any language.
- **Subheadline:** The fluid desktop player with zero-login local playlists, real-time Romanized lyrics, and granular offline control that respects your local disk.
- **Call to Action:**
  - **Primary CTA:** `Download for Free` (Detects OS: Windows x64, macOS Apple Silicon / Intel, Linux AppImage/deb)
  - **Secondary CTA:** `Explore Web Demo →`
- **Sub-CTA Reassurance:** *Free forever for local listening. Zero ads, zero login walls, zero telemetry.*
- **Hero Visual:**
  - Product screenshot / interactive mockup showcasing Flow in dark glassmorphism mode: persistent cyan audio scrubber, synchronized bilingual lyrics with Romaji toggle, and the floating QueueDrawer.
  - Image Path: `assets/flow_hero_preview.png` (Referencing official logo at `replica/assets/flow_logo.png`).

---

## 2. The Problem

*Why most desktop streaming apps feel sluggish, bloated, and restrictive:*

### 1. Sluggish Mobile Ports & Mid-Track Freezes
Most modern desktop players are clumsy mobile web wrappers. They chew through gigabytes of memory, stutter whenever stream quality shifts, and crash with cryptic errors when internal authentication webviews fail. If you listen on a laptop with HiDPI scaling, windows clip over display boundaries and controls disappear.

### 2. Locked-In Clouds & All-or-Nothing Cache Wipes
Want to make a playlist without surrendering your personal Google or Spotify account credentials? Good luck. Want to save timestamped lyrics for your car stereo or DAP? Impossible. And when your drive runs low on space, you're forced to nuke your entire cache rather than pruning the specific tracks you no longer want.

---

## 3. How It Works

Three effortless steps from search to sound:

```
[ Step 1: Discover ]           [ Step 2: Immerse ]             [ Step 3: Own ]
Instant zero-login search   ->  Gapless streaming &       ->    Save local playlists,
across songs and albums.        synced bilingual lyrics.        export .lrc & keep control.
```

1. **Search Freely:** Enter any song title, artist, or album. No account creation required. No tracking cookies following you around the web.
2. **Listen in Flow:** Enjoy ultra-low latency audio handover, dynamic ambient album bloom, and syllable-synchronized lyrics with instant Romaji/Hangul transliteration.
3. **Stay in Control:** Build custom local playlists, export `.lrc` timestamped lyrics directly to your hard drive, and selectively delete cached songs down to the megabyte.

---

## 4. Key Differentiators (Built from Real Listening Needs)

*We skipped gimmicks to fix what actual music fans needed:*

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

## 5. Transparent Pricing

*Generous free tier forever. Upgrade only if you need cloud sync across multiple machines.*

| Feature | Free Listener ($0) | Pro Explorer ($3.99/mo or $29/yr) | Lifetime Patron ($39 one-time) |
| :--- | :---: | :---: | :---: |
| Unlimited Desktop Streaming | ✅ | ✅ | ✅ |
| Synchronized Lyrics & Romaji | ✅ | ✅ | ✅ |
| Local Playlists & M3U8 Export | ✅ | ✅ | ✅ |
| 1-Click .lrc Lyrics Export | ✅ | ✅ | ✅ |
| Granular Cache Pruner | ✅ | ✅ | ✅ |
| Encrypted Cloud Playlist Sync | — | ✅ | ✅ |
| Shared Listen-Together Rooms | — | ✅ | ✅ |
| Perpetual Lifetime Updates | — | — | ✅ |
| Founder Discord Role & Badge | — | — | ✅ |

*Billing Guarantees: 1-click instant cancellation, 7-day advance annual renewal alerts, zero hidden fees, zero telemetry.*

---

## 6. Frequently Asked Questions

### Can I import my existing Spotify or YouTube Music playlists?
Yes. Flow features a built-in 1-click importer that accepts public playlist URLs or standard `.m3u8` playlist files, instantly populating your local collection.

### Do I need to create an account or sign in?
No! You can launch Flow, search millions of tracks, build local playlists, and export lyrics without ever typing an email address or password.

### Does Flow support offline playback?
Yes. Any cached track or downloaded audio file can be played offline without an active internet connection.

### How does the Romanized lyrics toggle work?
When playing tracks in Japanese, Korean, or Mandarin, Flow automatically computes phonetic Latin transcriptions (Romaji, Hangul, Pinyin) so you can sing along even if you cannot read the native script.

### What platforms are supported?
Flow runs natively on Windows 10/11 (x64/ARM64), macOS 12+ (Apple Silicon and Intel), and Linux (AppImage, deb, rpm).

---

## 7. Final Call to Action

- **Headline:** Ready to get into the flow?
- **Subheadline:** Download the player in seconds. No credit card, no sign-up wall.
- **Button:** `Download Flow for Windows / macOS / Linux`
- **Footer Links:** GitHub • Release Notes • Privacy Promise • Documentation
