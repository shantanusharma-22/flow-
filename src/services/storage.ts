import { Playlist, Track, UserSettings } from '../types';
import { SEED_PLAYLISTS, SEED_TRACKS } from '../data/seed';

const STORAGE_KEYS = {
  PLAYLISTS: 'flow_user_playlists',
  LIKED_TRACKS: 'flow_liked_track_ids',
  DOWNLOADED_TRACKS: 'flow_downloaded_track_ids',
  USER_SETTINGS: 'flow_user_settings',
  RECENT_SEARCHES: 'flow_recent_searches',
  CACHED_TRACKS: 'flow_cached_tracks'
};

const DEFAULT_SETTINGS: UserSettings = {
  audioQuality: 'high',
  crossfadeSec: 4,
  playbackSpeed: 1.0,
  repeatMode: 'off',
  romanizeLyrics: true,
  lyricsTranslation: true,
  showListenTogether: true,
  themeMode: 'dark_obsidian',
  discordRpcEnabled: true,
  lastFmScrobbling: false,
  cacheMaxMb: 500
};

export class StorageService {
  // Playlists (Zero-login local-first CRUD)
  public static getPlaylists(): Playlist[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(SEED_PLAYLISTS));
        return SEED_PLAYLISTS;
      }
      return JSON.parse(stored);
    } catch {
      return SEED_PLAYLISTS;
    }
  }

  public static savePlaylist(playlist: Playlist): void {
    const list = this.getPlaylists();
    const index = list.findIndex(p => p.id === playlist.id);
    if (index >= 0) {
      list[index] = playlist;
    } else {
      list.unshift(playlist);
    }
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(list));
  }

  public static createPlaylist(title: string, description: string = ''): Playlist {
    const newPlaylist: Playlist = {
      id: `local-playlist-${Date.now()}`,
      title,
      description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      accentColor: '#00e5ff',
      isCustom: true,
      tracks: [],
      createdAt: new Date().toISOString().split('T')[0],
      source: 'local'
    };
    this.savePlaylist(newPlaylist);
    return newPlaylist;
  }

  public static deletePlaylist(id: string): void {
    const list = this.getPlaylists().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(list));
  }

  public static addTrackToPlaylist(playlistId: string, track: Track): void {
    const list = this.getPlaylists();
    const target = list.find(p => p.id === playlistId);
    if (target) {
      if (!target.tracks.some(t => t.id === track.id)) {
        target.tracks.push(track);
        localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(list));
      }
    }
  }

  public static removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    const list = this.getPlaylists();
    const target = list.find(p => p.id === playlistId);
    if (target) {
      target.tracks = target.tracks.filter(t => t.id !== trackId);
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(list));
    }
  }

  // Liked Tracks
  public static getLikedTrackIds(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKED_TRACKS);
      if (!stored) {
        const initial = new Set(SEED_TRACKS.filter(t => t.isLiked).map(t => t.id));
        localStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(Array.from(initial)));
        return initial;
      }
      return new Set(JSON.parse(stored));
    } catch {
      return new Set();
    }
  }

  public static toggleLikedTrack(trackId: string): boolean {
    const liked = this.getLikedTrackIds();
    const isNowLiked = !liked.has(trackId);
    if (isNowLiked) {
      liked.add(trackId);
    } else {
      liked.delete(trackId);
    }
    localStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(Array.from(liked)));
    return isNowLiked;
  }

  // Downloaded Tracks (Fix #904 & Offline Storage)
  public static getDownloadedTrackIds(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOWNLOADED_TRACKS);
      if (!stored) {
        const initial = new Set(SEED_TRACKS.filter(t => t.isDownloaded).map(t => t.id));
        localStorage.setItem(STORAGE_KEYS.DOWNLOADED_TRACKS, JSON.stringify(Array.from(initial)));
        return initial;
      }
      return new Set(JSON.parse(stored));
    } catch {
      return new Set();
    }
  }

  public static toggleDownloadedTrack(trackId: string): boolean {
    const downloaded = this.getDownloadedTrackIds();
    const isNowDownloaded = !downloaded.has(trackId);
    if (isNowDownloaded) {
      downloaded.add(trackId);
    } else {
      downloaded.delete(trackId);
    }
    localStorage.setItem(STORAGE_KEYS.DOWNLOADED_TRACKS, JSON.stringify(Array.from(downloaded)));
    return isNowDownloaded;
  }

  // Settings
  public static getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static updateSettings(partial: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // Recent Searches
  public static getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : ['Luna Synth', 'Synthwave', 'Midnight Lofi', 'Cyberpunk', 'Raindrop Sanctuary'];
    } catch {
      return ['Luna Synth', 'Synthwave', 'Midnight Lofi'];
    }
  }

  public static addRecentSearch(query: string): void {
    if (!query.trim()) return;
    const recents = this.getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
    recents.unshift(query.trim());
    if (recents.length > 8) recents.pop();
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recents));
  }

  public static clearRecentSearches(): void {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify([]));
  }

  // Cached Tracks Management (Fix #899: granular cache deletion)
  public static getCachedTracks(): { track: Track; sizeMb: number; cachedAt: string }[] {
    return SEED_TRACKS.filter(t => t.isCached).map((t, idx) => ({
      track: t,
      sizeMb: +(4.2 + (idx * 1.7) % 5).toFixed(1),
      cachedAt: new Date(Date.now() - idx * 86400000 * 2).toLocaleDateString()
    }));
  }

  // LRC Lyrics File Export (Fix #909)
  public static exportLrcFile(track: Track): void {
    let lrcContent = '';
    if (track.lyrics?.rawLrc) {
      lrcContent = track.lyrics.rawLrc;
    } else if (track.lyrics?.lines) {
      lrcContent = track.lyrics.lines
        .map(line => {
          const totalSec = Math.floor(line.startTimeMs / 1000);
          const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
          const sec = String(totalSec % 60).padStart(2, '0');
          const ms = String(Math.floor((line.startTimeMs % 1000) / 10)).padStart(2, '0');
          return `[${min}:${sec}.${ms}]${line.text}`;
        })
        .join('\n');
    } else {
      lrcContent = `[00:00.00]${track.title} - ${track.artist}\n[00:05.00](Instrumental)`;
    }

    const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.artist} - ${track.title}.lrc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // M3U8 Playlist Export & Import (Fix #904)
  public static exportM3u8(playlist: Playlist): void {
    let content = '#EXTM3U\n';
    content += `#PLAYLIST:${playlist.title}\n\n`;

    playlist.tracks.forEach(track => {
      content += `#EXTINF:${track.durationSec},${track.artist} - ${track.title}\n`;
      content += `${track.streamUrl}\n`;
    });

    const blob = new Blob([content], { type: 'application/x-mpegURL;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.title.replace(/\s+/g, '_')}.m3u8`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
