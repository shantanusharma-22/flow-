import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { rateLimiter } from '../middleware/rateLimit';
import { FlowDatabase } from '../db';

import { YouTubeMusicService } from '../services/youtube';

export const searchRouter = Router();

searchRouter.get(
  '/',
  rateLimiter({ maxRequests: 120, windowMs: 60000 }),
  validate({
    query: z.object({
      q: z.string().min(1).max(100),
      category: z.enum(['all', 'songs', 'artists', 'albums', 'playlists']).optional().default('all'),
      limit: z.coerce.number().min(1).max(50).optional().default(20)
    })
  }),
  async (req: Request, res: Response) => {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'all';
    const parsedLimit = Number(req.query.limit);
    const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20;
    const queryPattern = `%${q.toLowerCase()}%`;

    // 1. Query Local SQLite DB
    let localSongs: any[] = [];
    let localArtists: any[] = [];
    let localAlbums: any[] = [];
    let localPlaylists: any[] = [];

    if (category === 'all' || category === 'songs') {
      localSongs = FlowDatabase.query(
        `SELECT id, title, artist_name as artist, artist_id as artistId, album_title as album,
                duration_sec as durationSec, thumbnail_url as thumbnailUrl, stream_url as streamUrl,
                audio_format as audioFormat, bitrate_kbps as bitrateKbps, is_liked as isLiked
         FROM tracks
         WHERE lower(title) LIKE ? OR lower(artist_name) LIKE ? OR lower(album_title) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, queryPattern, limit]
      );
    }

    if (category === 'all' || category === 'artists') {
      localArtists = FlowDatabase.query(
        `SELECT id, name, thumbnail_url as thumbnailUrl, description, subscribers_count as subscribersCount
         FROM artists
         WHERE lower(name) LIKE ? OR lower(description) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    if (category === 'all' || category === 'albums') {
      localAlbums = FlowDatabase.query(
        `SELECT id, title, artist_name as artistName, release_year as releaseYear,
                track_count as trackCount, thumbnail_url as thumbnailUrl
         FROM albums
         WHERE lower(title) LIKE ? OR lower(artist_name) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    if (category === 'all' || category === 'playlists') {
      localPlaylists = FlowDatabase.query(
        `SELECT id, title, description, thumbnail_url as thumbnailUrl,
                is_custom as isCustom, source, created_at as createdAt
         FROM playlists
         WHERE lower(title) LIKE ? OR lower(description) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    // 2. Query Live YouTube Music Innertube API
    let ytResults: { songs: any[]; artists: any[]; albums: any[]; playlists: any[] } = {
      songs: [],
      artists: [],
      albums: [],
      playlists: []
    };

    try {
      ytResults = await YouTubeMusicService.search(q, category as any, limit);

      // Cache newly discovered YouTube songs into SQLite for offline/history
      for (const song of ytResults.songs) {
        if (song.artistId) {
          try {
            FlowDatabase.run(
              `INSERT OR IGNORE INTO artists (id, name, thumbnail_url) VALUES (?, ?, ?);`,
              [song.artistId, song.artist, song.thumbnailUrl]
            );
          } catch { /* ignore */ }
        }
        try {
          FlowDatabase.run(
            `INSERT OR IGNORE INTO tracks (
              id, title, artist_name, artist_id, album_title, duration_sec,
              thumbnail_url, stream_url, audio_format, bitrate_kbps, is_liked, play_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?);`,
            [
              song.id,
              song.title,
              song.artist,
              song.artistId || null,
              song.album || 'YouTube Music Track',
              song.durationSec,
              song.thumbnailUrl,
              song.streamUrl,
              song.audioFormat || 'opus',
              song.bitrateKbps || 320,
              song.playCount || 100000
            ]
          );
        } catch { /* ignore */ }
      }
    } catch (err) {
      console.warn('[Search] YouTube Music live query failed, falling back to local database:', err);
    }

    // 3. Deduplicate and merge results (local matches take priority for liked/custom status)
    const seenSongIds = new Set<string>();
    const mergedSongs: any[] = [];

    for (const song of [...localSongs, ...ytResults.songs]) {
      if (!seenSongIds.has(song.id)) {
        seenSongIds.add(song.id);
        mergedSongs.push(song);
      }
    }

    const seenArtistNames = new Set<string>();
    const mergedArtists: any[] = [];
    for (const artist of [...localArtists, ...ytResults.artists]) {
      const key = (artist.name || '').toLowerCase();
      if (!seenArtistNames.has(key)) {
        seenArtistNames.add(key);
        mergedArtists.push(artist);
      }
    }

    const seenAlbums = new Set<string>();
    const mergedAlbums: any[] = [];
    for (const alb of [...localAlbums, ...ytResults.albums]) {
      const key = (alb.title || '').toLowerCase();
      if (!seenAlbums.has(key)) {
        seenAlbums.add(key);
        mergedAlbums.push(alb);
      }
    }

    const seenPlaylists = new Set<string>();
    const mergedPlaylists: any[] = [];
    for (const pl of [...localPlaylists, ...ytResults.playlists]) {
      const key = (pl.title || '').toLowerCase();
      if (!seenPlaylists.has(key)) {
        seenPlaylists.add(key);
        mergedPlaylists.push(pl);
      }
    }

    res.json({
      query: q,
      category,
      results: {
        songs: mergedSongs.slice(0, limit),
        artists: mergedArtists.slice(0, limit),
        albums: mergedAlbums.slice(0, limit),
        playlists: mergedPlaylists.slice(0, limit)
      }
    });
  }
);
