import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const queueRouter = Router();

// GET active queue
queueRouter.get('/', (req: Request, res: Response) => {
  const queue = FlowDatabase.query(
    `SELECT pq.position, pq.is_current as isCurrent, pq.is_autoplay as isAutoplay,
            t.id, t.title, t.artist_name as artist, t.thumbnail_url as thumbnailUrl,
            t.duration_sec as durationSec, t.stream_url as streamUrl
     FROM playback_queue pq
     JOIN tracks t ON pq.track_id = t.id
     ORDER BY pq.position ASC;`
  );

  res.json({
    queue,
    total: queue.length
  });
});

// POST add track to queue
queueRouter.post(
  '/',
  validate({
    body: z.object({
      trackId: z.string().min(1),
      playNext: z.boolean().optional().default(false)
    })
  }),
  (req: Request, res: Response) => {
    const { trackId, playNext } = req.body;

    if (playNext) {
      // Shift all existing positions by 1
      FlowDatabase.run('UPDATE playback_queue SET position = position + 1;');
      FlowDatabase.run('INSERT INTO playback_queue (position, track_id) VALUES (0, ?);', [trackId]);
    } else {
      const maxPos = FlowDatabase.get<{ maxPos: number | null }>('SELECT MAX(position) as maxPos FROM playback_queue;');
      const nextPos = (maxPos?.maxPos ?? -1) + 1;
      FlowDatabase.run('INSERT INTO playback_queue (position, track_id) VALUES (?, ?);', [nextPos, trackId]);
    }

    res.status(201).json({ success: true });
  }
);

// PUT reorder queue
queueRouter.put(
  '/reorder',
  validate({
    body: z.object({
      orderedTrackIds: z.array(z.string().min(1))
    })
  }),
  (req: Request, res: Response) => {
    const { orderedTrackIds } = req.body;

    FlowDatabase.run('DELETE FROM playback_queue;');
    orderedTrackIds.forEach((id: string, idx: number) => {
      FlowDatabase.run('INSERT INTO playback_queue (position, track_id) VALUES (?, ?);', [idx, id]);
    });

    res.json({ success: true, count: orderedTrackIds.length });
  }
);

// DELETE clear queue
queueRouter.delete('/', (req: Request, res: Response) => {
  FlowDatabase.run('DELETE FROM playback_queue;');
  res.json({ success: true, message: 'Queue cleared' });
});
