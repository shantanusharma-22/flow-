# Flow — Landing Page Specification (Web, Google Play, Microsoft Store & Mac App Store)

Copy, section layout, and messaging for the official **Flow** web presence at `https://getflow.audio/`, covering **Google Play**, **Microsoft Store**, **Mac App Store**, and instant in-browser playback.

---

## 1. Hero Section

- **Badge / Eyebrow:** `🌐 100% FREE ON GOOGLE PLAY • WEB • MICROSOFT STORE • MAC APP STORE`
- **Headline:** Stream effortlessly. Sing along in any language.
- **Subheadline:** The fluid music player with zero-login local playlists, real-time Romanized lyrics, and granular offline control that respects your device. 100% free everywhere.
- **Action CTAs:**
  1. `Get it on Google Play` → Direct link to Android phone, tablet, and DAP build.
  2. `Launch Web Player (Instant)` → Instant in-browser streaming with zero install.
  3. `Get it on Microsoft Store` → Direct link to Windows 10/11 native package.
  4. `Download on the Mac App Store` → Direct link to macOS universal binary.
- **Sub-CTA Reassurance:** *Zero audio ads • Zero subscriptions • Zero account walls • Zero telemetry.*
- **Hero Mockup Visual:** Dark obsidian glass stage showing live bilingual lyrics with phonetic Romaji toggle, lossless FLAC stream indicator, and persistent player dock.

---

## 2. Platform Capabilities: Android, Desktop & Web

### 🤖 Google Play & Android Power Features
- **Background Playback Included:** Listen with your screen turned off without paying a subscription fee.
- **Audio Focus Auto-Resume:** Automatically pauses during incoming calls or GPS driving instructions, and smoothly fades back in once the interruption ends.
- **Android DAP Compatibility:** External browser authentication eliminates embedded WebView crashes on specialized DAPs (HiBy, FiiO, Sony Walkman).
- **Local .lrc Export to Storage:** Save timestamped lyric files straight into your Android `Music/` folder with 1 tap.
- **Lockscreen & Android Auto:** Full MediaSession integration with rich album art, track scrub bar, and steering wheel media control support.

### 🪟 Windows & Mac Native Store Editions
- Clean integration with Windows 10/11 taskbars and macOS menus.
- Responsive HiDPI scaling eliminating window overflow on laptops.
- Dedicated 3-state loop button (Repeat-One) and pitch-preserving tempo sliders.

### ⚡ Instant Web Player (PWA)
- Zero install required. Jump straight into music on Chrome, Safari, Edge, or Firefox.
- Installable to home screen or desktop with 1-click.

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
Export perfectly timed `.lrc` lyric files directly to your local storage with a single click. Take your favorite lyrics to your car stereo, offline MP3 DAP, or media center.

### 📁 Zero-Login Local Playlists & `.m3u8` Export (Fix #904)
Create, reorder, and curate as many custom playlists as you want without signing in. Export your entire library to standard `.m3u8` format anytime.

### ⚡ Resilient Dual-Buffer Audio Engine & Focus Resume (Fix #903)
Zero stutter during bitrate transitions. External browser authentication ensures you never suffer from crashed internal webviews, while audio focus restores playback after GPS navigation.

### 🧹 Granular Cache Manager (Fix #899)
See exactly how much disk space each track occupies. Prune individual tracks with one click or set hard storage caps—never be forced to wipe your entire library again.

### 🔂 Dedicated Repeat-One & Tempo Controls (Fix #900 & #890)
Loop your current favorite track with a dedicated 3-state repeat button (Off / All / One) and fine-tune playback speed from 0.5x to 2.0x with preserved pitch.

---

## 5. Universal 100% Free Comparison

*100% free across all web, Android, and desktop platforms. No paywalls, no tiers.*

| Capability | Google Play (Android) | Microsoft Store (Windows) | Mac App Store (macOS) | Web App (`getflow.audio`) |
| :--- | :---: | :---: | :---: | :---: |
| Price | **Free ($0.00)** | **Free ($0.00)** | **Free ($0.00)** | **Free ($0.00)** |
| Background Playback | ✅ Included Free | ✅ | ✅ | ✅ |
| Synchronized Lyrics & Romaji | ✅ | ✅ | ✅ | ✅ |
| Zero-Login Local Playlists | ✅ | ✅ | ✅ | ✅ |
| 1-Click .lrc Lyrics Export | ✅ (Device Storage) | ✅ (Local File) | ✅ (Local File) | ✅ (Browser Download) |
| Audio Focus (GPS / Calls) | ✅ Auto-Resume | N/A | N/A | ✅ |
| Lockscreen / Car Controls | ✅ MediaSession / Auto | ✅ Windows SMTC | ✅ macOS Now Playing | ✅ Media Session API |
| Granular Cache Pruner | ✅ Single-Track MB | ✅ Single-Track MB | ✅ Single-Track MB | ✅ Browser Storage |
| Audio Ads or Tracking | 🚫 None | 🚫 None | 🚫 None | 🚫 None |

---

## 6. Frequently Asked Questions

### Is Flow completely free on Google Play?
Yes! Flow is 100% free ($0.00) on Google Play. Unlike other streaming apps, background playback, lyrics sync, and playlist creation are completely free with zero ads and zero in-app purchases.

### Does Flow support Android DAPs (HiBy, FiiO, Sony Walkman)?
Yes. Flow uses external browser authentication for Spotify/Google links, eliminating the crashes caused by outdated embedded WebViews on Android-powered DAPs.

### How does the Romanized lyrics toggle work?
When playing tracks in Japanese, Korean, or Mandarin, Flow automatically computes phonetic Latin transcriptions (Romaji, Hangul, Pinyin) so you can sing along in real time even if you cannot read the native characters.

### Can I export lyrics to my car stereo?
Yes! Tap the `.lrc` button on any track with synced lyrics to save a timestamped `.lrc` file to your storage. Perfect for car stereos and offline players.

### What Android versions are supported?
Flow supports Android 8.0 (Oreo) and later, fully optimized for Android 14 and Android 15.

---

## 7. Final Call to Action

- **Headline:** Ready to get into the flow?
- **Subheadline:** Download Flow free from Google Play, Microsoft Store, Mac App Store, or stream in browser.
- **Buttons:**
  - `Get it on Google Play`
  - `Get it on Microsoft Store`
  - `Download on Mac App Store`
  - `Launch Web Player`
- **Footer:** © 2026 Flow Audio • 100% Free & Open Music Player • GitHub • Release Notes • Privacy Promise
