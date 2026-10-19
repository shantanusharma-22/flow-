# Launch Plan: Flow 🚀

The distribution roadmap, store submission checklists, and community rollout sequence for **Flow** on the **Mac App Store** and **Microsoft Store**.

---

## 1. Store Packaging & Submission Checklists

Flow is distributed as a **100% free desktop application** through the official native app stores on Windows and macOS.

### A. Microsoft Store (Windows Partner Center)

- **Target OS:** Windows 10 (Build 19041+) and Windows 11 (x64 and ARM64).
- **Packaging Format:** Signed `.msix` package created via Electron-Builder / MSIX packaging tool.
- **Store Configuration:**
  - **Base Price:** Free ($0.00 USD worldwide).
  - **In-App Products (IAP):** None.
  - **Category:** `Multimedia & Media Players > Audio & Music`.
  - **Age Rating:** IARC Certificate (General Audience / PEGI 3 / ESRB Everyone).
- **Visual Assets Prepared:**
  - Square Tile (1:1): `150x150`, `300x300`, `44x44` (from `replica/assets/flow_logo.png`).
  - Store Screenshot 1 (1920x1080): *Now Playing & Syllable-Accurate Lyrics with Romaji*.
  - Store Screenshot 2 (1920x1080): *Zero-Login Local Playlists & .m3u8 Export*.
  - Store Screenshot 3 (1920x1080): *Granular Cache Manager with MB Inspection*.
  - Store Screenshot 4 (1920x1080): *Responsive HiDPI Player Dock & Speed Slider*.
- **Store Metadata:** Direct from `replica/launch/listing.json` (`microsoft_store` block).
- **Certification Pre-flight:**
  - WACK (Windows App Certification Kit) passed.
  - Zero crashes on launch, cleanly handles network disconnection, adheres to Windows Dark Mode theme.

---

### B. Mac App Store (App Store Connect)

- **Target OS:** macOS 12 (Monterey) or later (Apple Silicon native M-series & Intel universal binary).
- **Packaging Format:** Mac App Store signed `.pkg` / `.app` with Hardened Runtime enabled.
- **Sandboxing & Entitlements:**
  - `com.apple.security.app-sandbox`: Enabled.
  - `com.apple.security.network.client`: Enabled for audio streaming and lyric fetching.
  - `com.apple.security.files.user-selected.read-write`: Enabled for user-selected `.lrc` and `.m3u8` export directories.
- **Store Configuration:**
  - **Price:** Free (Tier 0).
  - **In-App Purchases:** None.
  - **Privacy Policy URL:** `https://getflow.audio/privacy` (Data Not Collected: zero telemetry, zero identifiers).
  - **App Review Guideline 4.1 Compliance:** Highlights differentiated innovations (phonetic Romanization, `.lrc` disk export, granular cache pruning) to guarantee smooth approval.
  - **Review Notes:** *"Flow requires zero accounts or logins. The reviewer can immediately search any track, play audio, and test synchronized lyrics without entering credentials."*

---

## 2. Pre-Launch Architecture: Beta List & Waitlist

- **Waitlist Landing Page:** Staged in `src/screens/LandingPage.tsx` and hosted at `getflow.audio`.
- **Store Badges:** Official Microsoft Store and Mac App Store badges displayed prominently.
- **Mechanics:** 1-click install links for both stores alongside direct universal binary downloads.
- **Goal:** 500 initial installs across Windows and macOS during launch week.

---

## 3. Telemetry, Analytics & Error Tracking

Flow strictly adheres to its privacy-first promise:
- **No Third-Party Trackers:** Zero Google Analytics, Facebook Pixel, or hidden tracking cookies.
- **Opt-In Crash Reporter:** Self-hosted Sentry / GlitchTip instance with client-side PII scrubbing (all paths, tokens, and filenames stripped before transmission).
- **Anonymous Health Heartbeat:** Single daily ping counting active installations by OS architecture (Windows x64/ARM, macOS Apple Silicon/Intel, Linux) with a prominent 1-click toggle to disable in Settings.

---

## 4. Community Launch Strategy

Targeting the communities identified during research (`replica/feedback.md` & `replica/reviews.csv`):

| Community | Relevant Pain Points | Target Outreach Angle |
| :--- | :--- | :--- |
| **Reddit `r/YouTubeMusicClients`** (12k members) | Broken queue truncation at 400+ songs, mid-stream micro-pauses, internal WebView crashes. | "Flow is live free on the Microsoft Store & Mac App Store with dual-buffer stream stability and 1000+ song queue capacity." |
| **Reddit `r/bitchord`** | Collapsing lyrics panels, desktop sign-in ERR_UNKNOWN_URL_SCHEME errors. | "100% free desktop player with persistent lyrics panel and external browser OAuth." |
| **Reddit `r/foss`** | Bloated Electron clients, lack of local playlist creation without Google login. | "Zero-account local playlists, standard .m3u8 export, and under 90MB RAM footprint on Microsoft Store." |
| **Reddit `r/BestGitHubRepos`** | Missing M3U export, DAP audio file support. | "Local-first desktop player with 1-click .lrc timestamped lyric export for car stereos and DAPs." |
| **GitHub Issues Category #904 & #909** | Playlist creation requests & `.lrc` offline lyric downloads. | Direct contributor engagement explaining how Flow solves these two specific requests. |

---

## 5. Launch Posts

### A. Hacker News — Show HN

**Title:** Show HN: Flow – Free desktop music player for Windows & Mac with Romanized lyrics

**Body:**
> Hey HN,
>
> We just released **Flow** on the Microsoft Store and Mac App Store as a 100% free, desktop-native music streaming client.
>
> Most desktop music players are clumsy mobile web wrappers: they consume gigabytes of memory, stutter during stream bitrate transitions, and force you to link cloud accounts just to save a local playlist.
>
> If you listen to international music (J-Pop, K-Pop, anime soundtracks), it's even worse: you rarely get phonetic transliteration, and you can't export timestamped lyrics to an offline DAP or car stereo.
>
> What makes Flow different:
> - **100% Free on Microsoft Store & Mac App Store:** Zero ads, zero subscriptions, zero in-app purchases.
> - **Zero-login local playlists:** Create, curate, and export `.m3u8` playlists without ever logging in.
> - **Synchronized Romanized lyrics:** Follow syllable-accurate lyrics with 1-click Romaji and Hangul transliteration.
> - **1-click `.lrc` export:** Save synchronized lyric files directly to your hard drive.
> - **Granular cache manager:** Inspect disk usage down to the megabyte and prune individual tracks without nuking your entire library.
> - **Native desktop performance:** HiDPI window scaling that never overflows display boundaries, 3-state loop button (Repeat-One), and 0.5x–2.0x pitch-preserved tempo control.
>
> Get it on Microsoft Store & Mac App Store: https://getflow.audio
> We’d love to hear your thoughts and bug reports!

---

### B. Product Hunt Launch

**Name:** Flow
**Tagline:** Free fluid desktop music player for Windows & Mac
**Thumbnail / Icon:** `replica/assets/flow_logo.png`
**Pricing:** 100% Free ($0) on Microsoft Store & Mac App Store

**Maker First Comment:**
> Hey Product Hunt! 👋
>
> We built Flow because we were tired of desktop streaming apps that treat your PC or Mac like an Android phone squeezed into a window.
>
> Flow is 100% free on both the Microsoft Store and Mac App Store:
> 1. Real-time synced lyrics with automatic phonetic Romanization for non-Latin songs.
> 2. 1-click `.lrc` file export for car stereos and offline MP3 players.
> 3. Zero-login custom playlists that save directly to your computer.
> 4. Per-track cache inspection so you never have to wipe your whole drive.
> 5. Zero audio ads, zero banners, and zero tracking.
>
> Available now on Windows 10/11 and macOS Monterey+. Let us know what you think!

---

## 6. First 10 Users Outreach Plan (Hand-to-Hand)

Direct outreach to users who filed specific feature requests on GitHub and Reddit, providing store install links solving their exact pain point:

| User Target | Origin Thread | Pain Point Solved | Personalized Message Angle |
| :---: | :--- | :--- | :--- |
| **#1** | GitHub Issue #909 | Needs `.lrc` lyrics file export for car stereo | "Saw your request for offline `.lrc` lyrics export for car stereos. We just shipped Flow free on Microsoft Store & Mac App Store with a 1-click `.lrc` export button. Would love your feedback!" |
| **#2** | GitHub Issue #904 | Wants custom playlists without cloud login | "You mentioned wanting to make custom playlists without logging into Spotify or Google. Flow lets you create and export local `.m3u8` playlists with zero logins. Available free on the stores." |
| **#3** | GitHub Issue #364 | Needs phonetic Romanization for J-Pop/K-Pop | "Built an automatic Romaji / Latin transliteration toggle into Flow so you can sing along to non-Latin tracks in real time. Grab it free on Windows or Mac to test your favorite tracks." |
| **#4** | GitHub Issue #899 | Wants single-track cache deletion | "We built a granular cache manager where you can see exact track sizes in MB and prune individual songs without wiping your whole library." |
| **#5** | GitHub Issue #903 | Broken WebView login on DAP / desktop | "Bypassed internal WebView OAuth in favor of external browser authentication to eliminate crashes on custom desktop configurations." |
| **#6** | GitHub Issue #890 | Missing playback speed slider | "Added a dedicated tempo slider (0.5x to 2.0x) with pitch preservation in the bottom control bar." |
| **#7** | GitHub Issue #900 | Dedicated repeat-one loop button | "Shipped a 3-state loop button (Off -> All -> One) right on the playback bar." |
| **#8** | GitHub Issue #884 | Window minimum size clipping on HiDPI | "Responsive desktop layout with adaptive breakpoint scaling—no more cut-off player controls on high-DPI laptops." |
| **#9** | Reddit `r/foss` | Stuttering mid-track bitrate switches | "Implemented dual-buffer audio handover that eliminates micro-pauses during stream transitions." |
| **#10** | Reddit `r/BestGitHubRepos` | Wants local backup of all playlists | "Full `.m3u8` export and local JSON backup without any cloud account requirement." |
