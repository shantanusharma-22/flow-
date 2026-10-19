export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    subscribers_count TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
    artist_name TEXT NOT NULL,
    release_year INTEGER,
    thumbnail_url TEXT,
    track_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);

CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
    album_title TEXT,
    album_id TEXT REFERENCES albums(id) ON DELETE SET NULL,
    duration_sec INTEGER NOT NULL CHECK (duration_sec > 0),
    thumbnail_url TEXT,
    stream_url TEXT,
    audio_format TEXT NOT NULL DEFAULT 'opus' CHECK (audio_format IN ('opus', 'aac', 'flac', 'mp3', 'wav')),
    bitrate_kbps INTEGER NOT NULL DEFAULT 160,
    is_liked INTEGER NOT NULL DEFAULT 0 CHECK (is_liked IN (0, 1)),
    is_cached INTEGER NOT NULL DEFAULT 0 CHECK (is_cached IN (0, 1)),
    is_downloaded INTEGER NOT NULL DEFAULT 0 CHECK (is_downloaded IN (0, 1)),
    local_file_path TEXT,
    file_size_bytes INTEGER DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    last_played_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_is_liked ON tracks(is_liked);
CREATE INDEX IF NOT EXISTS idx_tracks_is_downloaded ON tracks(is_downloaded);
CREATE INDEX IF NOT EXISTS idx_tracks_is_cached ON tracks(is_cached);
CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title);

CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_custom INTEGER NOT NULL DEFAULT 1 CHECK (is_custom IN (0, 1)),
    source TEXT NOT NULL DEFAULT 'local' CHECK (source IN ('local', 'youtube', 'spotify')),
    external_id TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_playlists_source ON playlists(source);
CREATE INDEX IF NOT EXISTS idx_playlists_title ON playlists(title);

CREATE TABLE IF NOT EXISTS playlist_tracks (
    playlist_id TEXT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    PRIMARY KEY (playlist_id, track_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_playlist_tracks_position ON playlist_tracks(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON playlist_tracks(track_id);

CREATE TABLE IF NOT EXISTS lyrics (
    track_id TEXT PRIMARY KEY REFERENCES tracks(id) ON DELETE CASCADE,
    is_synced INTEGER NOT NULL DEFAULT 0 CHECK (is_synced IN (0, 1)),
    plain_lyrics TEXT,
    synced_json TEXT NOT NULL DEFAULT '[]',
    raw_lrc TEXT,
    provider TEXT NOT NULL DEFAULT 'lrclib' CHECK (provider IN ('lrclib', 'youtube', 'kugou', 'local')),
    fetched_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS playback_queue (
    position INTEGER PRIMARY KEY,
    track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    is_current INTEGER NOT NULL DEFAULT 0 CHECK (is_current IN (0, 1)),
    is_autoplay INTEGER NOT NULL DEFAULT 0 CHECK (is_autoplay IN (0, 1)),
    added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_queue_track_id ON playback_queue(track_id);
CREATE INDEX IF NOT EXISTS idx_queue_is_current ON playback_queue(is_current);

CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT OR IGNORE INTO user_settings (key, value) VALUES
    ('audio_quality', 'high'),
    ('crossfade_sec', '3'),
    ('playback_speed', '1.0'),
    ('repeat_mode', 'off'),
    ('shuffle_enabled', '0'),
    ('romanize_lyrics', '1'),
    ('lyrics_translation', '0'),
    ('show_listen_together', '0'),
    ('theme_mode', 'dark_obsidian'),
    ('discord_rpc_enabled', '1'),
    ('download_dir', 'default_music_dir');
`;
