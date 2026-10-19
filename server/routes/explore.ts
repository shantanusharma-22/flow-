import { Router, Request, Response } from 'express';
import { YouTubeMusicService } from '../services/youtube';
import { FlowDatabase } from '../db';

export const exploreRouter = Router();

exploreRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const feed = await YouTubeMusicService.getExploreFeed();

    // If YouTube feed returned items, also cache them in SQLite
    if (feed.trendingTracks.length > 0) {
      for (const track of feed.trendingTracks) {
        FlowDatabase.run(
          `INSERT OR IGNORE INTO tracks (
            id, title, artist_name, album_title, duration_sec,
            thumbnail_url, stream_url, audio_format, bitrate_kbps, is_liked, play_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?);`,
          [
            track.id,
            track.title,
            track.artist,
            track.album,
            track.durationSec,
            track.thumbnailUrl,
            track.streamUrl,
            track.audioFormat,
            track.bitrateKbps,
            track.playCount
          ]
        );
      }
    }

    // Also get any local playlists
    const localPlaylists = FlowDatabase.query(
      `SELECT id, title, description, thumbnail_url as thumbnailUrl, is_custom as isCustom, source
       FROM playlists ORDER BY created_at DESC LIMIT 6;`
    );

    // Merge playlists
    const allPlaylists = [...localPlaylists, ...feed.featuredPlaylists];

    res.json({
      trendingTracks: feed.trendingTracks,
      featuredPlaylists: allPlaylists,
      popularArtists: feed.popularArtists
    });
  } catch (err) {
    console.error('[Explore Router Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve explore feed' });
  }
});
