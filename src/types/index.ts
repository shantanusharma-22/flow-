export type AudioFormat = 'opus' | 'aac' | 'flac' | 'mp3' | 'wav';

export interface LyricLine {
  startTimeMs: number;
  endTimeMs: number;
  text: string;
  romanized?: string;
  translation?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  durationSec: number;
  thumbnailUrl: string;
  streamUrl: string;
  audioFormat: AudioFormat;
  bitrateKbps: number;
  accentColor?: string;
  isLiked?: boolean;
  isDownloaded?: boolean;
  isCached?: boolean;
  playCount?: number;
  lyrics?: {
    isSynced: boolean;
    provider?: string;
    lines: LyricLine[];
    rawLrc?: string;
  };
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  accentColor?: string;
  isCustom: boolean;
  tracks: Track[];
  createdAt: string;
  source: 'local' | 'youtube' | 'spotify';
}

export interface Artist {
  id: string;
  name: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  description?: string;
  subscribersCount?: string;
  monthlyListeners?: string;
  topTracks: Track[];
  albums: {
    id: string;
    title: string;
    year: number;
    thumbnailUrl: string;
    trackCount: number;
  }[];
}

export type RepeatMode = 'off' | 'all' | 'one';

export type ScreenId = 'home' | 'search' | 'library' | 'playlist' | 'artist' | 'nowPlaying' | 'settings' | 'landing';

export interface NavigationState {
  currentScreen: ScreenId;
  playlistId?: string;
  artistId?: string;
}

export interface UserSettings {
  audioQuality: 'normal' | 'high' | 'lossless';
  crossfadeSec: number;
  playbackSpeed: number;
  repeatMode: RepeatMode;
  romanizeLyrics: boolean;
  lyricsTranslation: boolean;
  showListenTogether: boolean;
  themeMode: 'dark_obsidian' | 'oled_black' | 'mica_glass';
  discordRpcEnabled: boolean;
  lastFmScrobbling: boolean;
  cacheMaxMb: number;
}
