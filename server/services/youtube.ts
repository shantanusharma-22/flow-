export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  durationSec: number;
  thumbnailUrl: string;
  streamUrl: string;
  audioFormat: string;
  bitrateKbps: number;
  isLiked?: boolean;
  playCount?: number;
}

export interface YouTubeArtist {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscribersCount?: string;
  monthlyListeners?: string;
}

export interface YouTubeAlbum {
  id: string;
  title: string;
  artistName: string;
  releaseYear: number;
  thumbnailUrl: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isCustom: boolean;
  tracks: any[];
}

function parseDuration(str?: string): number {
  if (!str) return 180;
  const parts = str.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 180;
}

function findRenderers(obj: any, type: string, out: any[] = []): any[] {
  if (!obj || typeof obj !== 'object') return out;
  if (obj[type]) out.push(obj[type]);
  for (const k of Object.keys(obj)) {
    findRenderers(obj[k], type, out);
  }
  return out;
}

export class YouTubeMusicService {
  private static readonly INNERTUBE_BASE = 'https://music.youtube.com/youtubei/v1';

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'X-Origin': 'https://music.youtube.com',
      'Origin': 'https://music.youtube.com',
      'Referer': 'https://music.youtube.com/'
    };
  }

  public static async search(
    query: string,
    category: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all',
    limit: number = 25
  ): Promise<{
    songs: YouTubeTrack[];
    artists: YouTubeArtist[];
    albums: YouTubeAlbum[];
    playlists: YouTubePlaylist[];
  }> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    const payload = {
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20250101.01.00',
          hl: 'en',
          gl: 'US'
        }
      },
      query: trimmed
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${this.INNERTUBE_BASE}/search?prettyPrint=false`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[YouTubeMusicService] Search returned status ${res.status}`);
        return { songs: [], artists: [], albums: [], playlists: [] };
      }

      const data = await res.json();
      const items = findRenderers(data, 'musicResponsiveListItemRenderer');

      const songs: YouTubeTrack[] = [];
      const artists: YouTubeArtist[] = [];
      const albums: YouTubeAlbum[] = [];
      const playlists: YouTubePlaylist[] = [];

      for (const item of items) {
        const cols = item.flexColumns || [];
        const col0Runs = cols[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ||
                         cols[0]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs || [];
        const title = col0Runs.map((r: any) => r.text).join('').trim();
        if (!title) continue;

        const nav = col0Runs[0]?.navigationEndpoint || item.navigationEndpoint;
        const videoId = nav?.watchEndpoint?.videoId || item.playlistItemData?.videoId;

        const col1Runs = cols[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ||
                         cols[1]?.musicResponsiveListItemFlexColumnRenderer?.title?.runs || [];
        const col1Text = col1Runs.map((r: any) => r.text).join('');

        const thumbs = item.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
        let thumb = thumbs.length ? thumbs[thumbs.length - 1].url : '';
        if (thumb.startsWith('//')) thumb = 'https:' + thumb;

        if (videoId) {
          // Parse artist & duration
          let artistName = 'Various Artists';
          let durationStr = '3:20';
          const parts = col1Text.split('•').map((p: string) => p.trim());
          if (parts.length >= 2) {
            if (parts[parts.length - 1].includes(':')) {
              durationStr = parts[parts.length - 1];
            }
            if (!parts[0].toLowerCase().includes('song')) {
              artistName = parts[0];
            }
          } else if (parts.length === 1 && !parts[0].toLowerCase().includes('song')) {
            artistName = parts[0];
          }

          songs.push({
            id: videoId,
            title,
            artist: artistName,
            artistId: `yt-art-${videoId}`,
            album: 'YouTube Music Track',
            durationSec: parseDuration(durationStr),
            thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
            streamUrl: `https://www.youtube.com/watch?v=${videoId}`,
            audioFormat: 'opus',
            bitrateKbps: 320,
            isLiked: false,
            playCount: 145000 + Math.floor(Math.random() * 50000)
          });
        } else if (col1Text.toLowerCase().includes('artist') || item.menu?.menuRenderer?.items?.some((m: any) => m.menuNavigationItemRenderer?.icon?.iconType === 'SUBSCRIBE')) {
          artists.push({
            id: `yt-artist-${Buffer.from(title).toString('hex').slice(0, 10)}`,
            name: title,
            thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            subscribersCount: col1Text.replace(/Artist/i, '').replace(/•/g, '').trim() || 'Verified Artist',
            monthlyListeners: '2.4M'
          });
        } else if (col1Text.toLowerCase().includes('album') || col1Text.toLowerCase().includes('ep') || col1Text.toLowerCase().includes('single')) {
          albums.push({
            id: `yt-album-${Buffer.from(title).toString('hex').slice(0, 10)}`,
            title,
            artistName: trimmed,
            releaseYear: 2026,
            thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
          });
        } else if (col1Text.toLowerCase().includes('playlist')) {
          playlists.push({
            id: `yt-pl-${Buffer.from(title).toString('hex').slice(0, 10)}`,
            title,
            description: col1Text,
            thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
            isCustom: false,
            tracks: []
          });
        }
      }

      return {
        songs: songs.slice(0, limit),
        artists: artists.slice(0, limit),
        albums: albums.slice(0, limit),
        playlists: playlists.slice(0, limit)
      };
    } catch (err) {
      console.error('[YouTubeMusicService] Search exception:', err);
      return { songs: [], artists: [], albums: [], playlists: [] };
    }
  }

  public static async getExploreFeed(): Promise<{
    trendingTracks: YouTubeTrack[];
    featuredPlaylists: YouTubePlaylist[];
    popularArtists: YouTubeArtist[];
  }> {
    const payload = {
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20250101.01.00',
          hl: 'en',
          gl: 'US'
        }
      },
      browseId: 'FEmusic_home'
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${this.INNERTUBE_BASE}/browse?prettyPrint=false`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return { trendingTracks: [], featuredPlaylists: [], popularArtists: [] };
      }

      const data = await res.json();
      const twoRowItems = findRenderers(data, 'musicTwoRowItemRenderer');
      const responsiveItems = findRenderers(data, 'musicResponsiveListItemRenderer');

      const trendingTracks: YouTubeTrack[] = [];
      const featuredPlaylists: YouTubePlaylist[] = [];
      const popularArtists: YouTubeArtist[] = [];

      for (const item of twoRowItems) {
        const title = item.title?.runs?.[0]?.text;
        if (!title) continue;
        const sub = item.subtitle?.runs?.map((r: any) => r.text).join('') || '';
        const nav = item.navigationEndpoint;
        const videoId = nav?.watchEndpoint?.videoId;
        const thumbs = item.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
        let thumb = thumbs.length ? thumbs[thumbs.length - 1].url : '';
        if (thumb.startsWith('//')) thumb = 'https:' + thumb;

        if (videoId) {
          trendingTracks.push({
            id: videoId,
            title,
            artist: sub || 'Trending Artist',
            album: 'Trending Release',
            durationSec: 210,
            thumbnailUrl: thumb,
            streamUrl: `https://www.youtube.com/watch?v=${videoId}`,
            audioFormat: 'opus',
            bitrateKbps: 320,
            isLiked: false,
            playCount: 250000
          });
        } else {
          featuredPlaylists.push({
            id: `explore-pl-${Buffer.from(title).toString('hex').slice(0, 10)}`,
            title,
            description: sub,
            thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
            isCustom: false,
            tracks: []
          });
        }
      }

      if (trendingTracks.length === 0) {
        try {
          const topHits = await this.search('Top Global Hits', 'songs', 10);
          trendingTracks.push(...topHits.songs);
        } catch { }
      }

      return {
        trendingTracks: trendingTracks.slice(0, 12),
        featuredPlaylists: featuredPlaylists.slice(0, 10),
        popularArtists: popularArtists.slice(0, 6)
      };
    } catch (err) {
      console.error('[YouTubeMusicService] Explore exception:', err);
      return { trendingTracks: [], featuredPlaylists: [], popularArtists: [] };
    }
  }

  public static async getSynchronizedLyrics(title: string, artist: string): Promise<{
    isSynced: boolean;
    lines: Array<{ startTimeMs: number; endTimeMs: number; text: string; romanized?: string }>;
    rawLrc?: string;
  } | null> {
    try {
      const cleanTitle = title.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
      const cleanArtist = artist.split(',')[0].split('&')[0].trim();
      const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;

      const res = await fetch(url, {
        headers: { 'User-Agent': 'FlowMusic/1.0 (https://flowplayer.app)' },
        signal: AbortSignal.timeout(4000)
      });

      let syncedLyrics: string | null = null;
      let plainLyrics: string | null = null;

      if (res.ok) {
        const data = await res.json();
        syncedLyrics = data.syncedLyrics || null;
        plainLyrics = data.plainLyrics || null;
      }

      // Fallback: search by combined query if direct get didn't yield synced lyrics
      if (!syncedLyrics) {
        try {
          const searchClean = `${cleanTitle} ${cleanArtist}`.replace(/[|•-]/g, ' ').replace(/\s+/g, ' ').trim();
          const searchRes = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(searchClean)}`, {
            headers: { 'User-Agent': 'FlowMusic/1.0 (https://flowplayer.app)' },
            signal: AbortSignal.timeout(4000)
          });
          if (searchRes.ok) {
            const list = await searchRes.json();
            if (Array.isArray(list) && list.length > 0) {
              const matched = list.find((item: any) => item.syncedLyrics) || list[0];
              if (matched) {
                syncedLyrics = matched.syncedLyrics || null;
                plainLyrics = plainLyrics || matched.plainLyrics || null;
              }
            }
          }
        } catch { /* proceed with best effort */ }
      }

      if (syncedLyrics) {
        const rawLines = syncedLyrics.split('\n');
        const parsedLines: Array<{ startTimeMs: number; endTimeMs: number; text: string; romanized?: string }> = [];

        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i].trim();
          const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/);
          if (match) {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            const ms = parseInt(match[3].padEnd(3, '0').slice(0, 3), 10);
            const startTimeMs = min * 60000 + sec * 1000 + ms;
            const text = match[4].trim();

            if (parsedLines.length > 0) {
              parsedLines[parsedLines.length - 1].endTimeMs = startTimeMs;
            }

            parsedLines.push({
              startTimeMs,
              endTimeMs: startTimeMs + 4500,
              text: text || '♪',
              romanized: text
            });
          }
        }

        if (parsedLines.length > 0) {
          return {
            isSynced: true,
            lines: parsedLines,
            rawLrc: syncedLyrics
          };
        }
      }

      if (plainLyrics) {
        return {
          isSynced: false,
          lines: [{ startTimeMs: 0, endTimeMs: 180000, text: plainLyrics }],
          rawLrc: plainLyrics
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
