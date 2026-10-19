import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';
import { YouTubeMusicService } from '../services/youtube';

export const tracksRouter = Router();

// GET single track
tracksRouter.get(
  '/:id',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const track = FlowDatabase.get(
      `SELECT id, title, artist_name as artist, artist_id as artistId, album_title as album, album_id as albumId,
              duration_sec as durationSec, thumbnail_url as thumbnailUrl, stream_url as streamUrl,
              audio_format as audioFormat, bitrate_kbps as bitrateKbps, is_liked as isLiked,
              is_downloaded as isDownloaded, is_cached as isCached, play_count as playCount
       FROM tracks WHERE id = ?;`,
      [id]
    );

    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    res.json(track);
  }
);

// GET audio stream resolution
tracksRouter.get(
  '/:id/stream',
  validate({
    params: z.object({ id: z.string().min(1) }),
    query: z.object({
      quality: z.enum(['normal', 'high', 'lossless']).optional().default('high')
    })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { quality } = req.query as { quality: 'normal' | 'high' | 'lossless' };

    const track = FlowDatabase.get<{
      id: string;
      title: string;
      stream_url: string;
      audio_format: string;
      bitrate_kbps: number;
    }>('SELECT id, title, stream_url, audio_format, bitrate_kbps FROM tracks WHERE id = ?;', [id]);

    if (!track) {
      res.status(404).json({ error: 'Track stream not found' });
      return;
    }

    // Dynamic bitrate / quality tier negotiation
    const resolvedFormat = quality === 'lossless' ? 'flac' : quality === 'high' ? 'opus' : 'aac';
    const resolvedBitrate = quality === 'lossless' ? 1411 : quality === 'high' ? 320 : 160;

    res.json({
      trackId: track.id,
      title: track.title,
      streamUrl: track.stream_url,
      audioFormat: resolvedFormat,
      bitrateKbps: resolvedBitrate,
      expiresInSec: 21600, // 6 hours token validity
      source: 'flow_direct_stream'
    });
  }
);

// POST toggle like status
tracksRouter.post(
  '/:id/like',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const track = FlowDatabase.get<{ is_liked: number }>('SELECT is_liked FROM tracks WHERE id = ?;', [id]);

    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    const nextLiked = track.is_liked === 1 ? 0 : 1;
    FlowDatabase.run("UPDATE tracks SET is_liked = ?, updated_at = datetime('now') WHERE id = ?;", [nextLiked, id]);

    res.json({
      trackId: id,
      isLiked: nextLiked === 1
    });
  }
);

// POST mark downloaded
tracksRouter.post(
  '/:id/download',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    FlowDatabase.run("UPDATE tracks SET is_downloaded = 1, is_cached = 1, updated_at = datetime('now') WHERE id = ?;", [id]);

    res.json({
      trackId: id,
      isDownloaded: true,
      message: 'Track tagged and cached for offline playback.'
    });
  }
);

// POST scrobble track (increments play_count)
tracksRouter.post(
  '/:id/scrobble',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    FlowDatabase.run("UPDATE tracks SET play_count = coalesce(play_count, 0) + 1, updated_at = datetime('now') WHERE id = ?;", [id]);
    const track = FlowDatabase.get<{ play_count: number }>('SELECT play_count FROM tracks WHERE id = ?;', [id]);

    res.json({
      trackId: id,
      playCount: track?.play_count || 1,
      scrobbledAt: new Date().toISOString()
    });
  }
);

// GET synchronized lyrics alias
tracksRouter.get(
  '/:id/lyrics',
  validate({
    params: z.object({ id: z.string().min(1) }),
    query: z.object({
      title: z.string().optional(),
      artist: z.string().optional()
    }).optional()
  }),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const qTitle = req.query?.title as string | undefined;
    const qArtist = req.query?.artist as string | undefined;

    const lyricsRecord = FlowDatabase.get<{
      track_id: string;
      is_synced: number;
      synced_json: string;
      raw_lrc: string | null;
      provider: string;
    }>('SELECT * FROM lyrics WHERE track_id = ?;', [id]);

    if (lyricsRecord) {
      try {
        const lines = JSON.parse(lyricsRecord.synced_json || '[]');
        res.json({
          trackId: id,
          isSynced: lyricsRecord.is_synced === 1,
          lines,
          rawLrc: lyricsRecord.raw_lrc,
          provider: lyricsRecord.provider
        });
        return;
      } catch { /* proceed to live lookup */ }
    }

    // Attempt live LRCLIB fetch using track metadata from SQLite or query params
    const track = FlowDatabase.get<{ title: string; artist_name: string }>(
      'SELECT title, artist_name FROM tracks WHERE id = ?;',
      [id]
    );

    const titleToSearch = qTitle || track?.title;
    const artistToSearch = qArtist || track?.artist_name || '';

    if (titleToSearch) {
      const live = await YouTubeMusicService.getSynchronizedLyrics(titleToSearch, artistToSearch);
      if (live && live.lines.length > 0) {
        try {
          FlowDatabase.run(
            `INSERT OR REPLACE INTO lyrics (track_id, is_synced, synced_json, raw_lrc, provider)
             VALUES (?, ?, ?, ?, 'lrclib');`,
            [id, live.isSynced ? 1 : 0, JSON.stringify(live.lines), live.rawLrc || '']
          );
        } catch { /* ignore cache write error */ }

        res.json({
          trackId: id,
          isSynced: live.isSynced,
          lines: live.lines,
          rawLrc: live.rawLrc,
          provider: 'lrclib'
        });
        return;
      }
    }

    res.json({
      trackId: id,
      isSynced: false,
      lines: [],
      rawLrc: null,
      provider: 'none'
    });
  }
);

