import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

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
