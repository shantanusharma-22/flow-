import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { FlowDatabase } from '../db';

export const integrationsRouter = Router();

// POST Scrobble Hook (Last.fm & ListenBrainz)
integrationsRouter.post(
  '/scrobble',
  validate({
    body: z.object({
      trackId: z.string().min(1),
      timestamp: z.number(),
      playbackPercentage: z.number().min(0).max(100)
    })
  }),
  (req: Request, res: Response) => {
    const { trackId, playbackPercentage } = req.body;

    if (playbackPercentage < 50) {
      res.json({ scrobbled: false, reason: 'Playback under 50% threshold' });
      return;
    }

    // Update play count in database
    FlowDatabase.run(
      "UPDATE tracks SET play_count = play_count + 1, last_played_at = datetime('now') WHERE id = ?;",
      [trackId]
    );

    res.json({
      scrobbled: true,
      trackId,
      timestamp: Date.now(),
      services: ['Last.fm (Simulated)', 'ListenBrainz']
    });
  }
);

// POST Discord Rich Presence Update
integrationsRouter.post(
  '/discord-rpc',
  validate({
    body: z.object({
      trackTitle: z.string().min(1),
      artistName: z.string().min(1),
      durationSec: z.number(),
      currentTimeSec: z.number(),
      isPlaying: z.boolean()
    })
  }),
  (req: Request, res: Response) => {
    const { trackTitle, artistName, isPlaying } = req.body;

    res.json({
      success: true,
      discordStatus: {
        state: `by ${artistName}`,
        details: isPlaying ? `Listening to ${trackTitle}` : `Paused: ${trackTitle}`,
        largeImageKey: 'flow_logo',
        largeImageText: 'Flow Desktop Player'
      }
    });
  }
);

// POST Listen Together WebRTC Room Session
integrationsRouter.post('/listen-together/create-room', (req: Request, res: Response) => {
  const roomCode = `FLOW-${Math.floor(1000 + Math.random() * 9000)}`;
  res.json({
    roomCode,
    meshEndpoint: `wss://mesh.flowplayer.local/room/${roomCode}`,
    createdTimestamp: Date.now()
  });
});
