# Component Specifications: Flow Design System

Reconstructed from `replica/recon.md` and customized for Flow's fluid desktop streaming interface.

---

### 1. PlayerBar (Bottom Dock)
```
PlayerBar
  variants   standard (desktop dock), compact (window resize)
  sizes      height 84px, width 100% viewport, fixed bottom
  states     playing, paused, buffering, seeking, muted
  tokens     bg surface-glass (backdrop-filter: blur-glass), border border, shadow popover
  layout     3-column flex: Left (Track Artwork 56x56 + Title/Artist), Center (Playback Controls + ScrubBar), Right (Volume + Lyrics + Queue + Loop)
  a11y       role="region" aria-label="Audio Player", Spacebar toggles Play/Pause, Left/Right seeks 5s, Up/Down adjusts volume
  used on    all screens (S01–S09 persistent dock)
```

---

### 2. TrackRow
```
TrackRow
  variants   standard (with album/date), compact (queue/search history), numbered (album/playlist detail)
  sizes      height 56px, horizontal padding 16px, gap 12px
  states     default, hover (shows Play button overlay on thumbnail), active/playing (accent equalizer wave animation), selected, disabled
  tokens     bg transparent (hover: surface-hover, active: surface-active), text text, text-muted text-muted, radius md
  components [Index/PlayIcon] [Artwork 44x44, radius sm] [Title + Explicit Badge] [Artist] [Album] [Duration] [HeartButton] [MoreButton]
  a11y       tabIndex=0, Enter/DoubleClick plays track, ContextMenu key opens actions menu
  used on    S01, S02, S05, S06, S07, S08
```

---

### 3. MediaCard
```
MediaCard
  variants   square (album/playlist), circular (artist avatar), hero (featured banner)
  sizes      card width 180px–220px, artwork aspect 1:1, border-radius lg (square) / pill (artist)
  states     default, hover (elevates -4px, shadow-card, displays glowing Play button circle in bottom-right of artwork), focus-visible (2px ring accent)
  tokens     bg surface, border border-subtle, text text, text-muted text-muted, shadow card
  a11y       role="button", Enter navigates to detail page (S06/S07)
  used on    S01 (Discover Feed), S06 (Related Releases), S07 (Artist Discography), S08 (Library)
```

---

### 4. ScrubBar (Interactive Timeline)
```
ScrubBar
  variants   slim (resting 4px), expanded (hover 8px)
  sizes      width 100%, track height 4px (hover 8px), thumb diameter 14px
  states     default, hovering (reveals scrub thumb + timestamp tooltip), dragging/seeking (thumb scale 1.25, accent-glow)
  tokens     bg border-subtle, progress-fill accent, buffer-fill surface-active, thumb on-accent with shadow-glow
  physics    smooth CSS transition on height, zero-jitter position polling
  a11y       role="slider" aria-label="Playback Progress" aria-valuemin=0 aria-valuemax=duration aria-valuenow=currentTime
  used on    PlayerBar, S03 (Now Playing)
```

---

### 5. SyncedLyricsViewer
```
SyncedLyricsViewer
  variants   fullscreen (Now Playing overlay), split-view (docked side drawer)
  sizes      full-height, max-width 720px centered, line height 44px
  states     lyrics loading skeleton, synced karaoke active, plain unsynced static fallback, empty ("No lyrics available")
  tokens     text text-faint (inactive lines opacity 0.35), text-active text (opacity 1.0, font-size +4px, text-shadow: glow-violet)
  features   click lyric stanza to seek audio timestamp, toggle Romanized transliteration sub-line, dual-line translation
  a11y       auto-scrolls with smooth lerp physics without fighting manual user scrolling
  used on    S04
```

---

### 6. SidebarNav
```
SidebarNav
  variants   expanded (desktop default 240px), collapsed (tablet/narrow 72px)
  sizes      width 240px, full-height, border-right 1px solid border
  states     default, item hover (surface-hover), item active (surface-active, accent indicator line or pill)
  tokens     bg bg, border border, text text-muted (active: text with accent icon)
  sections   Header (Flow Logo + Wordmark), Main Navigation (Home, Search, Library), Secondary (Liked Songs, Downloads, Local Audio), Custom Playlists list
  a11y       <nav aria-label="Primary Navigation">, accessible keyboard arrow navigation
  used on    all screens (left shell)
```

---

### 7. ContextMenu (Action Popover)
```
ContextMenu
  variants   track menu, playlist menu, download menu
  sizes      min-width 200px, item height 36px, padding 6px
  states     closed, open, item hover (bg surface-hover, text accent), item disabled
  tokens     bg surface-glass (backdrop-filter: blur-glass), border border, shadow popover, radius md
  options    Play Next, Add to Queue, Add to Playlist (submenu), Go to Artist, Go to Album, Download Offline, Export .lrc / .m3u8
  a11y       role="menu", role="menuitem", Esc closes, auto-repositions inside viewport bounds
  used on    S01, S02, S05, S06, S07, S08
```

---

### 8. LoopButton (3-State Repeat)
```
LoopButton
  variants   icon toggle
  sizes      36x36px button, 20px icon
  states     Off (icon muted opacity 0.5), All (icon accent, glow aura), One (icon accent, badge indicator '1')
  tokens     hover surface-hover, active accent, text text
  a11y       aria-label="Repeat: Off / All / One", cycles on click
  used on    PlayerBar, S03 (Now Playing)
```

---

### 9. SpeedControl (Tempo & Pitch)
```
SpeedControl
  variants   dock popup, settings slider
  sizes      pill selector 48px width, slider 0.5x to 2.0x (steps of 0.05x)
  states     normal (1.0x), altered speed (accent badge), pitch-preserved toggle active
  tokens     bg surface, text text, slider-thumb accent
  a11y       aria-label="Playback speed"
  used on    PlayerBar controls menu, S09 (Settings)
```

---

### 10. ModalDialog
```
ModalDialog
  variants   create playlist, external browser oauth, cache inspection
  sizes      sm (360px), md (480px), lg (640px)
  states     closed, opening animation (scale 0.95 -> 1.0, fade in), open, closing
  tokens     backdrop rgba(0,0,0,0.7) blur(12px), container bg surface, border border, radius lg
  a11y       role="dialog" aria-modal="true", traps focus, Esc dismisses, initial focus on primary input
  used on    S08 (Create Playlist), S09 (Connect Accounts)
```
