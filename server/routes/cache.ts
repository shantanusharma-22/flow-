import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const cacheRouter = Router();

// Fix #899: GET granular cache overview
cacheRouter.get('/', (req: Request, res: Response) => {
  const cachedTracks = FlowDatabase.query(`
    SELECT id, title, artist_name as artist, thumbnail_url as thumbnailUrl,
           audio_format as audioFormat, bitrate_kbps as bitrateKbps,
           file_size_bytes as fileSizeBytes, updated_at as cachedAt
    FROM tracks
    WHERE is_cached = 1 OR is_downloaded = 1
    ORDER BY updated_at DESC;
  `);

  const totalBytes = cachedTracks.reduce((acc, t) => acc + (t.fileSizeBytes || 4500000), 0);
  const totalMb = +(totalBytes / (1024 * 1024)).toFixed(1);

  res.json({
    totalMb,
    count: cachedTracks.length,
    tracks: cachedTracks.map(t => ({
      ...t,
      sizeMb: +((t.fileSizeBytes || 4500000) / (1024 * 1024)).toFixed(1)
    }))
  });
});

// Fix #899: DELETE single track from cache
cacheRouter.delete(
  '/:id',
  validate({
    params: z.object({ id: z.string().min(1) })
  }),
  (req: Request, res: Response) => {
    const { id } = req.params;
    FlowDatabase.run('UPDATE tracks SET is_cached = 0, is_downloaded = 0 WHERE id = ?;', [id]);

    res.json({
      success: true,
      trackId: id,
      message: 'Track removed from disk cache (Fix #899).'
    });
  }
);

// DELETE purge all cache
cacheRouter.delete('/', (req: Request, res: Response) => {
  FlowDatabase.run('UPDATE tracks SET is_cached = 0, is_downloaded = 0;');
  res.json({ success: true, message: 'All cached audio purged.' });
});
