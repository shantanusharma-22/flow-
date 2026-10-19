import { FlowDatabase } from './index';
import { runMigrations } from './migrate';

export function runSeeds(): void {
  runMigrations();
  console.log('🌱 [Flow Seed] Seeding database with realistic media entities...');

  // 1. Seed Artists
  const artists = [
    {
      id: 'artist-01',
      name: 'Luna Synth',
      thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      description: 'Tokyo and Berlin-based electronic producer sculpting melancholic analog synths with futuristic pop sensibilities.',
      subscribers_count: '482K'
    },
    {
      id: 'artist-02',
      name: 'Kaito Void',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      description: 'Pioneer of rain-drenched midnight chillhop, blending jazz piano chords with organic field recordings.',
      subscribers_count: '620K'
    },
    {
      id: 'artist-03',
      name: 'Celeste Bloom',
      thumbnail_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      description: 'Ethereal ambient composer weaving celestial harmonics and modular synthesizers into dreamlike acoustic soundscapes.',
      subscribers_count: '315K'
    },
    {
      id: 'artist-04',
      name: 'Aethelgard',
      thumbnail_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
      description: 'Cyberpunk darkwave architect forging driving industrial beats, aggressive synth leads, and raw dystopian energy.',
      subscribers_count: '540K'
    }
  ];

  for (const a of artists) {
    FlowDatabase.run(
      `INSERT OR REPLACE INTO artists (id, name, thumbnail_url, description, subscribers_count)
       VALUES (?, ?, ?, ?, ?);`,
      [a.id, a.name, a.thumbnail_url, a.description, a.subscribers_count]
    );
  }

  // 2. Seed Albums
  const albums = [
    { id: 'album-01', title: 'Synthetic Horizons', artist_id: 'artist-01', artist_name: 'Luna Synth', release_year: 2026, track_count: 10, thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
    { id: 'album-02', title: 'Midnight Tokyo Memories', artist_id: 'artist-02', artist_name: 'Kaito Void', release_year: 2025, track_count: 8, thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80' },
    { id: 'album-03', title: 'Celestial Drift', artist_id: 'artist-03', artist_name: 'Celeste Bloom', release_year: 2026, track_count: 9, thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80' },
    { id: 'album-04', title: 'Neo Matrix Overdrive', artist_id: 'artist-04', artist_name: 'Aethelgard', release_year: 2025, track_count: 12, thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80' }
  ];

  for (const alb of albums) {
    FlowDatabase.run(
      `INSERT OR REPLACE INTO albums (id, title, artist_id, artist_name, release_year, track_count, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [alb.id, alb.title, alb.artist_id, alb.artist_name, alb.release_year, alb.track_count, alb.thumbnail_url]
    );
  }

  // 3. Seed Tracks
  const tracks = [
    {
      id: 'track-01',
      title: 'Neon Odyssey',
      artist_name: 'Luna Synth',
      artist_id: 'artist-01',
      album_title: 'Synthetic Horizons',
      album_id: 'album-01',
      duration_sec: 214,
      thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
      stream_url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
      audio_format: 'opus',
      bitrate_kbps: 320,
      is_liked: 1,
      is_cached: 1,
      is_downloaded: 1,
      play_count: 142850
    },
    {
      id: 'track-02',
      title: 'Raindrop Sanctuary',
      artist_name: 'Kaito Void',
      artist_id: 'artist-02',
      album_title: 'Midnight Tokyo Memories',
      album_id: 'album-02',
      duration_sec: 186,
      thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      stream_url: 'https://cdn.freesound.org/previews/659/659687_11861866-lq.mp3',
      audio_format: 'flac',
      bitrate_kbps: 920,
      is_liked: 1,
      is_cached: 1,
      is_downloaded: 1,
      play_count: 98400
    },
    {
      id: 'track-03',
      title: 'Astral Resonance',
      artist_name: 'Celeste Bloom',
      artist_id: 'artist-03',
      album_title: 'Celestial Drift',
      album_id: 'album-03',
      duration_sec: 248,
      thumbnail_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
      stream_url: 'https://cdn.freesound.org/previews/462/462808_838627-lq.mp3',
      audio_format: 'opus',
      bitrate_kbps: 320,
      is_liked: 0,
      is_cached: 1,
      is_downloaded: 0,
      play_count: 65120
    },
    {
      id: 'track-04',
      title: 'Cyberpunk Skyline',
      artist_name: 'Aethelgard',
      artist_id: 'artist-04',
      album_title: 'Neo Matrix Overdrive',
      album_id: 'album-04',
      duration_sec: 198,
      thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
      stream_url: 'https://cdn.freesound.org/previews/558/558694_11861866-lq.mp3',
      audio_format: 'aac',
      bitrate_kbps: 256,
      is_liked: 1,
      is_cached: 0,
      is_downloaded: 0,
      play_count: 112300
    }
  ];

  for (const t of tracks) {
    FlowDatabase.run(
      `INSERT OR REPLACE INTO tracks (id, title, artist_name, artist_id, album_title, album_id, duration_sec, thumbnail_url, stream_url, audio_format, bitrate_kbps, is_liked, is_cached, is_downloaded, play_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [t.id, t.title, t.artist_name, t.artist_id, t.album_title, t.album_id, t.duration_sec, t.thumbnail_url, t.stream_url, t.audio_format, t.bitrate_kbps, t.is_liked, t.is_cached, t.is_downloaded, t.play_count]
    );
  }

  // 4. Seed Synchronized Lyrics (Fix #364, #439, #909)
  const lyrics01 = [
    { startTimeMs: 0, endTimeMs: 8500, text: '♪ (Atmospheric synth intro plays softly) ♪', romanized: '♪ [Instrumental opening] ♪', translation: '♪ [Instrumental opening] ♪' },
    { startTimeMs: 8500, endTimeMs: 14200, text: '夜の街に揺れるネオンの光', romanized: 'Yoru no machi ni yureru neon no hikari', translation: 'Neon lights swaying across the nocturnal metropolis' },
    { startTimeMs: 14200, endTimeMs: 20400, text: '遠くへと消えていく影を追う', romanized: 'Tooku e to kiete iku kage o ou', translation: 'Chasing shadows that dissolve into the distance' },
    { startTimeMs: 20400, endTimeMs: 27100, text: '誰も知らない秘密の鼓動が', romanized: 'Dare mo shiranai himitsu no kodou ga', translation: 'A secret pulse that nobody else recognizes' },
    { startTimeMs: 27100, endTimeMs: 34800, text: 'デジタルの海に響き渡る', romanized: 'Dejitaru no umi ni hibiki wataru', translation: 'Echoes continuously through the digital ocean' }
  ];

  FlowDatabase.run(
    `INSERT OR REPLACE INTO lyrics (track_id, is_synced, synced_json, raw_lrc, provider)
     VALUES (?, ?, ?, ?, ?);`,
    [
      'track-01',
      1,
      JSON.stringify(lyrics01),
      `[00:08.50]夜の街に揺れるネオンの光\n[00:14.20]遠くへと消えていく影を追う\n[00:20.40]誰も知らない秘密の鼓動が\n[00:27.10]デジタルの海に響き渡る`,
      'lrclib'
    ]
  );

  // 5. Seed Playlists
  const playlists = [
    { id: 'playlist-01', title: 'Flow Discover Weekly', description: 'Curated deep-groove electronic and neo-synthwave.', is_custom: 0, source: 'youtube', thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
    { id: 'playlist-02', title: 'Tokyo Midnight Cyberpunk', description: 'Dark club energy and heavy synth basslines.', is_custom: 0, source: 'youtube', thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80' },
    { id: 'playlist-03', title: 'Midnight Lo-Fi Coding Sanctuary', description: 'Warm vinyl crackle and gentle Rhodes chords (Fix #904).', is_custom: 1, source: 'local', thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80' }
  ];

  for (const pl of playlists) {
    FlowDatabase.run(
      `INSERT OR REPLACE INTO playlists (id, title, description, is_custom, source, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [pl.id, pl.title, pl.description, pl.is_custom, pl.source, pl.thumbnail_url]
    );
  }

  // Seed Playlist Tracks
  FlowDatabase.run(`INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position) VALUES ('playlist-01', 'track-01', 0);`);
  FlowDatabase.run(`INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position) VALUES ('playlist-01', 'track-02', 1);`);
  FlowDatabase.run(`INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position) VALUES ('playlist-02', 'track-04', 0);`);
  FlowDatabase.run(`INSERT OR REPLACE INTO playlist_tracks (playlist_id, track_id, position) VALUES ('playlist-03', 'track-02', 0);`);

  console.log('✅ [Flow Seed] Database seeding complete.');
}

if (process.argv[1] && process.argv[1].includes('seed')) {
  runSeeds();
}
