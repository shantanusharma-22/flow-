import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const playlistsRouter = Router();

// GET all playlists
playlistsRouter.get('/', (req: Request, res: Response) => {
  const playlists = FlowDatabase.query(`
    SELECT p.id, p.title, p.description, p.thumbnail_url as thumbnailUrl,
           p.is_custom as isCustom, p.source, p.created_at as createdAt,
           COUNT(pt.track_id) as trackCount
    FROM playlists p
    LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `);

  res.json(playlists);
});

// Fix #904: POST create playlist without login
playlistsRouter.post(
  '/',
  validate({
    body: z.object({
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional().default(''),
      thumbnailUrl: z.string().url().optional()
    })
  }),
  (req: Request, res: Response) => {
    const { title, description, thumbnailUrl } = req.body;
    const id = `local-pl-${crypto.randomBytes(6).toString('hex')}`;
    const defaultThumb = thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80';

    FlowDatabase.run(
      `INSERT INTO playlists (id, title, description, thumbnail_url, is_custom, source)
       VALUES (?, ?, ?, ?, 1, 'local');`,
      [id, title, description, defaultThumb]
    );

    res.status(201).json({
      id,
      title,
      description,
      thumbnailUrl: defaultThumb,
      isCustom: true,
      source: 'local',
      trackCount: 0,
      createdAt: new Date().toISOString()
    });
  }
);

// GET playlist by id with tracks
playlistsRouter.get(
  '/:id',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const playlist = FlowDatabase.get(
      'SELECT id, title, description, thumbnail_url as thumbnailUrl, is_custom as isCustom, source, created_at as createdAt FROM playlists WHERE id = ?;',
      [id]
    );

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    const tracks = FlowDatabase.query(
      `SELECT t.id, t.title, t.artist_name as artist, t.album_title as album,
              t.duration_sec as durationSec, t.thumbnail_url as thumbnailUrl,
              t.stream_url as streamUrl, t.audio_format as audioFormat,
              t.bitrate_kbps as bitrateKbps, t.is_liked as isLiked, pt.position
       FROM playlist_tracks pt
       JOIN tracks t ON pt.track_id = t.id
       WHERE pt.playlist_id = ?
       ORDER BY pt.position ASC;`,
      [id]
    );

    res.json({
      ...playlist,
      tracks
    });
  }
);

// DELETE playlist
playlistsRouter.delete(
  '/:id',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    FlowDatabase.run('DELETE FROM playlists WHERE id = ?;', [id]);
    res.json({ success: true, message: 'Playlist deleted' });
  }
);

// POST add track to playlist
playlistsRouter.post(
  '/:id/tracks',
  validate({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({ trackId: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { trackId } = req.body;

    const countRes = FlowDatabase.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM playlist_tracks WHERE playlist_id = ?;',
      [id]
    );
    const position = countRes?.count || 0;

    try {
      FlowDatabase.run(
        `INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id, position)
         VALUES (?, ?, ?);`,
        [id, trackId, position]
      );
      res.status(201).json({ success: true, position });
    } catch {
      res.status(500).json({ error: 'Failed to add track to playlist' });
    }
  }
);

// DELETE remove track from playlist
playlistsRouter.delete(
  '/:id/tracks/:trackId',
  validate({
    params: z.object({
      id: z.string().min(1),
      trackId: z.string().min(1)
    })
  }),
  (req: Request, res: Response) => {
    const { id, trackId } = req.params;
    FlowDatabase.run('DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?;', [id, trackId]);
    res.json({ success: true, message: 'Track removed from playlist' });
  }
);

// GET Export M3U8 Playlist (Fix #904 & Differentiator)
playlistsRouter.get(
  '/:id/export-m3u',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const playlist = FlowDatabase.get<{ title: string }>('SELECT title FROM playlists WHERE id = ?;', [id]);

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    const tracks = FlowDatabase.query<{
      title: string;
      artist_name: string;
      duration_sec: number;
      stream_url: string;
    }>(
      `SELECT t.title, t.artist_name, t.duration_sec, t.stream_url
       FROM playlist_tracks pt
       JOIN tracks t ON pt.track_id = t.id
       WHERE pt.playlist_id = ?
       ORDER BY pt.position ASC;`,
      [id]
    );

    let m3u = '#EXTM3U\n';
    m3u += `#PLAYLIST:${playlist.title}\n\n`;

    tracks.forEach(t => {
      m3u += `#EXTINF:${t.duration_sec},${t.artist_name} - ${t.title}\n`;
      m3u += `${t.stream_url}\n`;
    });

    res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${playlist.title.replace(/\s+/g, '_')}.m3u8"`);
    res.send(m3u);
  }
);
