import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { rateLimiter } from '../middleware/rateLimit';
import { FlowDatabase } from '../db';

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
  (req: Request, res: Response) => {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'all';
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const queryPattern = `%${q.toLowerCase()}%`;

    const results: {
      songs: any[];
      artists: any[];
      albums: any[];
      playlists: any[];
    } = {
      songs: [],
      artists: [],
      albums: [],
      playlists: []
    };

    if (category === 'all' || category === 'songs') {
      results.songs = FlowDatabase.query(
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
      results.artists = FlowDatabase.query(
        `SELECT id, name, thumbnail_url as thumbnailUrl, description, subscribers_count as subscribersCount
         FROM artists
         WHERE lower(name) LIKE ? OR lower(description) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    if (category === 'all' || category === 'albums') {
      results.albums = FlowDatabase.query(
        `SELECT id, title, artist_name as artistName, release_year as releaseYear,
                track_count as trackCount, thumbnail_url as thumbnailUrl
         FROM albums
         WHERE lower(title) LIKE ? OR lower(artist_name) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    if (category === 'all' || category === 'playlists') {
      results.playlists = FlowDatabase.query(
        `SELECT id, title, description, thumbnail_url as thumbnailUrl,
                is_custom as isCustom, source, created_at as createdAt
         FROM playlists
         WHERE lower(title) LIKE ? OR lower(description) LIKE ?
         LIMIT ?;`,
        [queryPattern, queryPattern, limit]
      );
    }

    res.json({
      query: q,
      category,
      results
    });
  }
);
