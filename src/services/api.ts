import { Track, Playlist, LyricLine, UserSettings } from '../types';
import { SEED_TRACKS, SEED_PLAYLISTS, SEED_ARTISTS } from '../data/seed';
import { StorageService } from './storage';

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

class FlowApiClient {
  private backendAvailable: boolean = true;
  private lastHealthCheck: number = 0;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    const url = `${API_BASE}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[Flow API] Request to ${endpoint} returned status ${response.status}`);
        return null;
      }

      this.backendAvailable = true;
      return (await response.json()) as T;
    } catch (err) {
      clearTimeout(timeoutId);
      this.backendAvailable = false;
      return null;
    }
  }

  public async checkHealth(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastHealthCheck < 10000) return this.backendAvailable;
    this.lastHealthCheck = now;

    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      this.backendAvailable = res.ok;
      return res.ok;
    } catch {
      this.backendAvailable = false;
      return false;
    }
  }

  public isBackendOnline(): boolean {
    return this.backendAvailable;
  }

  // --- Search ---
  public async search(
    query: string,
    category: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all',
    limit: number = 20
  ): Promise<{ songs: Track[]; artists: any[]; albums: any[]; playlists: any[] }> {
    const q = query.trim();
    if (!q) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    const data = await this.request<{
      results: { songs: any[]; artists: any[]; albums: any[]; playlists: any[] };
    }>(`/search?q=${encodeURIComponent(q)}&category=${category}&limit=${limit}`);

    if (data && data.results) {
      // Map raw db rows to Track type
      const songs: Track[] = (data.results.songs || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        artist: s.artist || s.artist_name,
        artistId: s.artistId,
        album: s.album || s.album_title,
        albumId: s.albumId,
        durationSec: s.durationSec || s.duration_sec || 180,
        thumbnailUrl: s.thumbnailUrl || s.thumbnail_url,
        streamUrl: s.streamUrl || s.stream_url,
        audioFormat: s.audioFormat || s.audio_format || 'opus',
        bitrateKbps: s.bitrateKbps || s.bitrate_kbps || 320,
        isLiked: Boolean(s.isLiked ?? s.is_liked),
        isDownloaded: Boolean(s.isDownloaded ?? s.is_downloaded),
        isCached: Boolean(s.isCached ?? s.is_cached),
        playCount: s.playCount ?? s.play_count ?? 0
      }));

      return {
        songs,
        artists: data.results.artists || [],
        albums: data.results.albums || [],
        playlists: data.results.playlists || []
      };
    }

    // Graceful offline fallback
    const lower = q.toLowerCase();
    const fallbackSongs = SEED_TRACKS.filter(
      t =>
        t.title.toLowerCase().includes(lower) ||
        t.artist.toLowerCase().includes(lower) ||
        (t.album && t.album.toLowerCase().includes(lower))
    );
    const fallbackArtists = SEED_ARTISTS.filter(a => a.name.toLowerCase().includes(lower));
    const fallbackPlaylists = SEED_PLAYLISTS.filter(p => p.title.toLowerCase().includes(lower));

    return {
      songs: fallbackSongs,
      artists: fallbackArtists,
      albums: [],
      playlists: fallbackPlaylists
    };
  }

  // --- Explore & Trending Feed ---
  public async getExploreFeed(): Promise<{
    trendingTracks: Track[];
    featuredPlaylists: Playlist[];
    popularArtists: any[];
  } | null> {
    const data = await this.request<{
      trendingTracks: any[];
      featuredPlaylists: any[];
      popularArtists: any[];
    }>('/explore');

    if (data && data.trendingTracks) {
      const trendingTracks: Track[] = data.trendingTracks.map((s: any) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        album: s.album,
        durationSec: s.durationSec || 210,
        thumbnailUrl: s.thumbnailUrl,
        streamUrl: s.streamUrl,
        audioFormat: s.audioFormat || 'opus',
        bitrateKbps: s.bitrateKbps || 320,
        isLiked: Boolean(s.isLiked),
        isDownloaded: false,
        isCached: false,
        playCount: s.playCount || 200000
      }));

      const featuredPlaylists: Playlist[] = (data.featuredPlaylists || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        thumbnailUrl: p.thumbnailUrl,
        isCustom: Boolean(p.isCustom),
        tracks: [],
        createdAt: new Date().toISOString(),
        source: 'youtube'
      }));

      return {
        trendingTracks,
        featuredPlaylists,
        popularArtists: data.popularArtists || []
      };
    }

    return null;
  }

  // --- Tracks & Playback ---
  public async getTrack(id: string): Promise<Track | null> {
    const data = await this.request<any>(`/tracks/${id}`);
    if (data) {
      return {
        id: data.id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        album: data.album,
        albumId: data.albumId,
        durationSec: data.durationSec,
        thumbnailUrl: data.thumbnailUrl,
        streamUrl: data.streamUrl,
        audioFormat: data.audioFormat,
        bitrateKbps: data.bitrateKbps,
        isLiked: Boolean(data.isLiked),
        isDownloaded: Boolean(data.isDownloaded),
        isCached: Boolean(data.isCached),
        playCount: data.playCount
      };
    }
    return SEED_TRACKS.find(t => t.id === id) || null;
  }

  public async getStream(id: string, quality: 'normal' | 'high' | 'lossless' = 'high'): Promise<any> {
    return await this.request(`/tracks/${id}/stream?quality=${quality}`);
  }

  public async toggleLike(id: string): Promise<boolean> {
    // Optimistically toggle locally
    StorageService.toggleLikedTrack(id);

    const res = await this.request<{ isLiked: boolean }>(`/tracks/${id}/like`, { method: 'POST' });
    if (res) {
      return res.isLiked;
    }
    return StorageService.getLikedTrackIds().has(id);
  }

  public async markDownloaded(id: string): Promise<boolean> {
    StorageService.toggleDownloadedTrack(id);
    const res = await this.request<{ isDownloaded: boolean }>(`/tracks/${id}/download`, { method: 'POST' });
    return res ? res.isDownloaded : true;
  }

  public async scrobbleTrack(id: string): Promise<void> {
    await this.request(`/tracks/${id}/scrobble`, { method: 'POST' });
  }

  // --- Lyrics ---
  public async getLyrics(trackId: string, title?: string, artist?: string): Promise<{ isSynced: boolean; lines: LyricLine[]; rawLrc?: string } | null> {
    const qParams = new URLSearchParams();
    if (title) qParams.set('title', title);
    if (artist) qParams.set('artist', artist);
    const queryString = qParams.toString() ? `?${qParams.toString()}` : '';

    const res = await this.request<{
      trackId: string;
      isSynced: boolean;
      lines: LyricLine[];
      rawLrc?: string;
    }>(`/tracks/${trackId}/lyrics${queryString}`);

    if (res && res.lines && res.lines.length > 0) {
      return res;
    }

    // Fallback to embedded lyrics in seed track
    const seed = SEED_TRACKS.find(t => t.id === trackId);
    if (seed?.lyrics) {
      return seed.lyrics;
    }

    return null;
  }

  public async romanizeLyrics(lines: LyricLine[]): Promise<LyricLine[]> {
    const res = await this.request<{ romanizedLines: LyricLine[] }>('/lyrics/romanize', {
      method: 'POST',
      body: JSON.stringify({ lines })
    });
    return res?.romanizedLines || lines;
  }

  // --- Playlists ---
  public async getPlaylists(): Promise<Playlist[]> {
    const data = await this.request<any[]>('/playlists');
    if (data && Array.isArray(data)) {
      return data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
        isCustom: Boolean(p.isCustom),
        tracks: [],
        createdAt: p.createdAt || new Date().toISOString(),
        source: (p.source as 'local' | 'youtube' | 'spotify') || 'local'
      }));
    }
    return StorageService.getPlaylists();
  }

  public async getPlaylistDetails(id: string): Promise<Playlist | null> {
    const data = await this.request<any>(`/playlists/${id}`);
    if (data) {
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        isCustom: Boolean(data.isCustom),
        tracks: (data.tracks || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          album: t.album,
          durationSec: t.durationSec,
          thumbnailUrl: t.thumbnailUrl,
          streamUrl: t.streamUrl,
          audioFormat: t.audioFormat || 'opus',
          bitrateKbps: t.bitrateKbps || 320,
          isLiked: Boolean(t.isLiked)
        })),
        createdAt: data.createdAt,
        source: data.source || 'local'
      };
    }
    return StorageService.getPlaylists().find(p => p.id === id) || null;
  }

  public async createPlaylist(title: string, description: string = '', thumbnailUrl?: string): Promise<Playlist> {
    // Persist to local storage
    const localCreated = StorageService.createPlaylist(title, description);

    const res = await this.request<Playlist>('/playlists', {
      method: 'POST',
      body: JSON.stringify({ title, description, thumbnailUrl })
    });

    if (res) {
      return {
        ...res,
        tracks: []
      };
    }
    return localCreated;
  }

  public async addTrackToPlaylist(playlistId: string, track: Track): Promise<boolean> {
    StorageService.addTrackToPlaylist(playlistId, track);

    const res = await this.request<{ success: boolean }>(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ trackId: track.id })
    });
    return res ? res.success : true;
  }

  public async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    StorageService.removeTrackFromPlaylist(playlistId, trackId);

    const res = await this.request<{ success: boolean }>(`/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
    return res ? res.success : true;
  }

  public async deletePlaylist(playlistId: string): Promise<boolean> {
    StorageService.deletePlaylist(playlistId);

    const res = await this.request<{ success: boolean }>(`/playlists/${playlistId}`, {
      method: 'DELETE'
    });
    return res ? res.success : true;
  }

  // --- Cache (Fix #899) ---
  public async getCacheStats(): Promise<{ totalMb: number; count: number; tracks: any[] }> {
    const res = await this.request<{ totalMb: number; count: number; tracks: any[] }>('/cache');
    if (res) {
      return res;
    }
    const localCached = StorageService.getCachedTracks();
    const totalMb = +(localCached.reduce((sum: number, c: { sizeMb?: number }) => sum + (c.sizeMb || 4.5), 0)).toFixed(1);
    return {
      totalMb,
      count: localCached.length,
      tracks: localCached
    };
  }

  public async removeCachedTrack(trackId: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/cache/${trackId}`, { method: 'DELETE' });
    return res ? res.success : true;
  }

  public async clearAllCache(): Promise<boolean> {
    const res = await this.request<{ success: boolean }>('/cache', { method: 'DELETE' });
    return res ? res.success : true;
  }

  // --- Settings ---
  public async getSettings(): Promise<Partial<UserSettings> | null> {
    const res = await this.request<Record<string, string>>('/settings');
    if (!res) return null;

    return {
      audioQuality: (res.audio_quality as any) || 'high',
      crossfadeSec: Number(res.crossfade_sec || 0),
      playbackSpeed: Number(res.playback_speed || 1.0),
      romanizeLyrics: res.romanize_lyrics === 'true',
      lyricsTranslation: res.lyrics_translation === 'true',
      themeMode: (res.theme_mode as any) || 'dark_obsidian',
      discordRpcEnabled: res.discord_rpc === 'true',
      lastFmScrobbling: res.lastfm_scrobble === 'true'
    };
  }

  public async saveSettings(settings: Partial<UserSettings>): Promise<boolean> {
    const payload: Record<string, string> = {};
    if (settings.audioQuality) payload.audio_quality = settings.audioQuality;
    if (settings.crossfadeSec !== undefined) payload.crossfade_sec = String(settings.crossfadeSec);
    if (settings.playbackSpeed !== undefined) payload.playback_speed = String(settings.playbackSpeed);
    if (settings.romanizeLyrics !== undefined) payload.romanize_lyrics = String(settings.romanizeLyrics);
    if (settings.lyricsTranslation !== undefined) payload.lyrics_translation = String(settings.lyricsTranslation);
    if (settings.themeMode) payload.theme_mode = settings.themeMode;
    if (settings.discordRpcEnabled !== undefined) payload.discord_rpc = String(settings.discordRpcEnabled);
    if (settings.lastFmScrobbling !== undefined) payload.lastfm_scrobble = String(settings.lastFmScrobbling);

    const res = await this.request<{ success: boolean }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res ? res.success : false;
  }

  // --- Local Library & Spotify Resolver ---
  public async scanLocalLibrary(directoryPath?: string): Promise<{
    success: boolean;
    directory: string;
    scannedFilesFound: number;
    newlyIndexedTracks: number;
    totalLocalTracks: number;
    message: string;
  } | null> {
    return await this.request('/library/scan', {
      method: 'POST',
      body: JSON.stringify({ directoryPath })
    });
  }

  public async getLocalFiles(): Promise<Track[]> {
    const res = await this.request<{ tracks: any[] }>('/library/local-files');
    return (res?.tracks || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      album: s.album,
      durationSec: s.durationSec,
      thumbnailUrl: s.thumbnailUrl,
      streamUrl: s.streamUrl,
      audioFormat: s.audioFormat || 'flac',
      bitrateKbps: s.bitrateKbps || 1411,
      isLiked: Boolean(s.isLiked)
    }));
  }

  public async resolveSpotifyUri(uri: string): Promise<{ resolvedTitle: string; tracks: Track[] } | null> {
    const res = await this.request<{
      success: boolean;
      resolvedTitle: string;
      tracks: any[];
    }>(`/library/spotify-resolve?uri=${encodeURIComponent(uri)}`);

    if (res && res.tracks) {
      return {
        resolvedTitle: res.resolvedTitle,
        tracks: res.tracks.map((s: any) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          durationSec: s.durationSec || 180,
          thumbnailUrl: s.thumbnailUrl,
          streamUrl: s.streamUrl,
          audioFormat: s.audioFormat || 'opus',
          bitrateKbps: s.bitrateKbps || 320,
          isLiked: Boolean(s.isLiked)
        }))
      };
    }
    return null;
  }

  public async getWatcherStatus(): Promise<{
    active: boolean;
    watchedDirectory: string;
    lastIndexedFile: string | null;
    lastEventTime: string | null;
    totalEventsDetected: number;
    totalLocalTracks: number;
  } | null> {
    return await this.request('/library/watcher');
  }

  // --- Listen Together / Jam Sessions ---
  public async listJamRooms(): Promise<Array<{
    code: string;
    name: string;
    hostName: string;
    memberCount: number;
    maxMembers: number;
    currentTrackTitle: string;
    currentTrackArtist: string;
    isPlaying: boolean;
  }>> {
    const res = await this.request<{ rooms: any[] }>('/jam/rooms');
    return res?.rooms || [];
  }

  public async createJamRoom(params: {
    roomName?: string;
    userName?: string;
    hostOnlyControl?: boolean;
    currentTrack?: Track | null;
  }): Promise<{ room: any; member: any; inviteUrl: string } | null> {
    return await this.request('/jam/create', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  public async joinJamRoom(code: string, userName?: string): Promise<{ room: any; member: any } | null> {
    return await this.request('/jam/join', {
      method: 'POST',
      body: JSON.stringify({ code, userName })
    });
  }

  public async getJamRoomState(code: string): Promise<any | null> {
    return await this.request(`/jam/room/${encodeURIComponent(code)}`);
  }

  public async syncJamRoom(
    code: string,
    memberId: string,
    action: 'play' | 'pause' | 'seek' | 'setTrack' | 'next' | 'previous',
    data?: { track?: Track; currentTimeSec?: number; isPlaying?: boolean }
  ): Promise<{ success: boolean; room: any } | null> {
    return await this.request(`/jam/room/${encodeURIComponent(code)}/sync`, {
      method: 'POST',
      body: JSON.stringify({
        memberId,
        action,
        ...data
      })
    });
  }

  public async leaveJamRoom(code: string, memberId: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/jam/room/${encodeURIComponent(code)}/leave`, {
      method: 'POST',
      body: JSON.stringify({ memberId })
    });
    return res ? res.success : false;
  }
}

export const api = new FlowApiClient();
