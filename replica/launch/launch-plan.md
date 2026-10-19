# Launch Plan: Flow 🚀

The distribution roadmap, community outreach, and rollout sequence for **Flow**.

---

## 1. Pre-Launch Architecture: Beta List & Waitlist

- **Waitlist Landing Page:** Hosted at `getflow.audio` (staged locally as `src/screens/LandingPage.tsx`).
- **Waitlist Mechanics:** Simple email intake with instant confirmation, device selector (Windows / macOS / Linux), and option to join the Discord / GitHub Discussions alpha channel.
- **Goal:** 250 qualified desktop audio enthusiasts before public launch.

---

## 2. Telemetry, Analytics & Error Tracking

In keeping with Flow's privacy-first brand principles:
- **No Third-Party Trackers:** Zero Google Analytics, Facebook Pixel, or hidden tracking cookies.
- **Opt-In Crash Reporter:** Self-hosted Sentry / GlitchTip instance with client-side PII scrubbing (all paths, tokens, and filenames stripped before transmission).
- **Anonymous Health Heartbeat:** Single daily ping counting active installations by OS architecture (Windows x64/ARM, macOS Apple Silicon/Intel, Linux) with a prominent 1-click toggle to disable in Settings.

---

## 3. Where Unhappy Users Congregate

Targeting the exact communities identified during the research phase (`replica/feedback.md` & `replica/reviews.csv`):

| Community | Relevant Pain Points | Target Outreach Angle |
| :--- | :--- | :--- |
| **Reddit `r/YouTubeMusicClients`** (12k members) | Broken queue truncation at 400+ songs, mid-stream micro-pauses, internal WebView crashes. | "We built an audio engine with resilient dual-buffering and 1000+ song queue capacity." |
| **Reddit `r/bitchord`** | Collapsing lyrics panels, desktop sign-in ERR_UNKNOWN_URL_SCHEME errors. | "Persistent lyrics panel that stays open across song transitions + external browser OAuth." |
| **Reddit `r/foss`** | Bloated Electron clients, lack of local playlist creation without Google login. | "Zero-account local playlists, standard .m3u8 export, and under 90MB RAM footprint." |
| **Reddit `r/BestGitHubRepos`** | Missing M3U export, DAP audio file support. | "Local-first desktop player with 1-click .lrc timestamped lyric export for car stereos and DAPs." |
| **GitHub Issues Category #904 & #909** | Playlist creation requests & `.lrc` offline lyric downloads. | Direct contributor engagement explaining how Flow solves these two specific requests. |

---

## 4. Launch Posts

### A. Hacker News — Show HN

**Title:** Show HN: Flow – A fluid desktop music player with Romanized lyrics and local playlists

**Body:**
> Hey HN,
>
> Over the past few months, we noticed that most desktop music streaming clients are clumsy mobile ports: they wrap heavyweight WebViews that crash during logins, hitch when switching bitrates, and force you to link cloud accounts just to save a local playlist.
>
> If you listen to international music (J-Pop, K-Pop, anime soundtracks), it's even worse: you rarely get phonetic transliteration, and you can't export timestamped lyrics to an offline DAP or car stereo.
>
> We built **Flow**:
> - **Zero-login local playlists:** Create, curate, and export `.m3u8` playlists without ever logging in.
> - **Synchronized Romanized lyrics:** Follow syllable-accurate lyrics with 1-click Romaji and Hangul transliteration.
> - **1-click `.lrc` export:** Save synchronized lyric files directly to your hard drive.
> - **Granular cache manager:** Inspect disk usage down to the megabyte and prune individual tracks without nuking your entire library.
> - **Desktop-first performance:** Native HiDPI scaling that doesn't clip on laptops, 3-state loop button (Repeat-One), and 0.5x–2.0x pitch-preserved tempo control.
>
> The desktop player is 100% free with zero telemetry.
>
> Code & binaries: https://getflow.audio
> We’d love to hear your thoughts and bug reports!

---

### B. Product Hunt Launch

**Name:** Flow
**Tagline:** The fluid desktop music player with synced Romanized lyrics
**Thumbnail / Icon:** `replica/assets/flow_logo.png`
**Pricing:** Free ($0) + optional Pro ($3.99/mo or $39 lifetime)

**Maker First Comment:**
> Hey Product Hunt! 👋
>
> We built Flow because we were tired of desktop streaming apps that treat your computer like an Android phone squeezed into a window.
>
> Flow gives you:
> 1. Real-time synced lyrics with automatic phonetic Romanization for non-Latin songs.
> 2. 1-click `.lrc` file export for car stereos and offline MP3 players.
> 3. Zero-login custom playlists that save directly to your computer.
> 4. Per-track cache inspection so you never have to wipe your whole drive.
>
> Try it today on Windows, macOS, or Linux. Everything in the core player is completely free forever. Let us know what you think!

---

## 5. First 10 Users Outreach Plan (Hand-to-Hand)

Direct outreach to users who filed specific feature requests on GitHub and Reddit, sharing early beta builds that directly address their exact pain point:

| User Target | Origin Thread | Pain Point Solved | Personalized Message Angle |
| :---: | :--- | :--- | :--- |
| **#1** | GitHub Issue #909 | Needs `.lrc` lyrics file export for car stereo | "Saw your request for offline `.lrc` lyrics export for car stereos. We just shipped Flow with a dedicated 1-click `.lrc` export button. Would love your feedback on whether the timing works with your car unit." |
| **#2** | GitHub Issue #904 | Wants custom playlists without cloud login | "You mentioned wanting to make custom playlists without logging into Spotify or Google. Flow lets you create and export local `.m3u8` playlists with zero logins." |
| **#3** | GitHub Issue #364 | Needs phonetic Romanization for J-Pop/K-Pop | "Built an automatic Romaji / Latin transliteration toggle into Flow so you can sing along to non-Latin tracks in real time. Can you test it with your favorite J-Pop tracks?" |
| **#4** | GitHub Issue #899 | Wants single-track cache deletion | "We built a granular cache manager where you can see exact track sizes in MB and prune individual songs without wiping your whole library." |
| **#5** | GitHub Issue #903 | Broken WebView login on DAP / desktop | "Bypassed internal WebView OAuth in favor of external browser authentication to eliminate crashes on custom desktop configurations and DAPs." |
| **#6** | GitHub Issue #890 | Missing playback speed slider | "Added a dedicated tempo slider (0.5x to 2.0x) with pitch preservation in the bottom control bar." |
| **#7** | GitHub Issue #900 | Dedicated repeat-one loop button | "Shipped a 3-state loop button (Off -> All -> One) right on the playback bar." |
| **#8** | GitHub Issue #884 | Window minimum size clipping on HiDPI | "Responsive desktop layout with adaptive breakpoint scaling—no more cut-off player controls on high-DPI laptops." |
| **#9** | Reddit `r/foss` | Stuttering mid-track bitrate switches | "Implemented dual-buffer audio handover that eliminates micro-pauses during stream transitions." |
| **#10** | Reddit `r/BestGitHubRepos` | Wants local backup of all playlists | "Full `.m3u8` export and local JSON backup without any cloud account requirement." |
