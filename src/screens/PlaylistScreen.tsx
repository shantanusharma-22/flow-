import React from 'react';
import { Play, Shuffle, Download, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { Playlist, Track } from '../types';
import { TrackRow } from '../components/TrackRow';
import { StorageService } from '../services/storage';

interface PlaylistScreenProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayTrack: (track: Track) => void;
  onPlayAll: (playlist: Playlist) => void;
  onShuffleAll: (playlist: Playlist) => void;
  onToggleLike: (trackId: string) => void;
  onContextMenu: (e: React.MouseEvent, track: Track) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  onBack: () => void;
  onArtistClick: (artistId: string) => void;
}

export const PlaylistScreen: React.FC<PlaylistScreenProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onPlayAll,
  onShuffleAll,
  onToggleLike,
  onContextMenu,
  onDeletePlaylist,
  onBack,
  onArtistClick
}) => {
  const totalDurationSec = playlist.tracks.reduce((acc, t) => acc + t.durationSec, 0);
  const totalMinutes = Math.floor(totalDurationSec / 60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '40px' }}>
      {/* Back navigation button */}
      <div>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '6px 14px', fontSize: '13px' }}>
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      {/* Playlist Hero Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '28px',
        padding: '24px 0',
        borderBottom: '1px solid var(--color-border-subtle)'
      }}>
        <img
          src={playlist.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
          alt={playlist.title}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: 'var(--radius-lg)',
            objectFit: 'cover',
            boxShadow: 'var(--shadow-card)',
            flexShrink: 0
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)' }}>
            {playlist.isCustom ? 'Custom Local Playlist' : 'Curated Playlist'}
          </span>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {playlist.title}
          </h1>

          {playlist.description && (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '600px', lineHeight: 1.4 }}>
              {playlist.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            <span>{playlist.tracks.length} tracks</span>
            <span>•</span>
            <span>{totalMinutes} minutes</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>Source: {playlist.source}</span>
          </div>
        </div>
      </div>

      {/* Action Bar (Play All, Shuffle, Export M3U8, Delete) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-primary"
            disabled={playlist.tracks.length === 0}
            onClick={() => onPlayAll(playlist)}
          >
            <Play size={18} fill="#040711" />
            <span>Play All</span>
          </button>

          <button
            className="btn-secondary"
            disabled={playlist.tracks.length === 0}
            onClick={() => onShuffleAll(playlist)}
          >
            <Shuffle size={16} />
            <span>Shuffle</span>
          </button>

          {/* Fix #904: M3U8 Export */}
          <button
            className="btn-secondary"
            disabled={playlist.tracks.length === 0}
            onClick={() => StorageService.exportM3u8(playlist)}
            title="Export standard .M3U8 playlist file (Fix #904)"
          >
            <FileText size={16} />
            <span>Export M3U8</span>
          </button>
        </div>

        {playlist.isCustom && onDeletePlaylist && (
          <button
            className="btn-secondary"
            onClick={() => {
              if (confirm(`Delete local playlist "${playlist.title}"?`)) {
                onDeletePlaylist(playlist.id);
              }
            }}
            style={{ color: 'var(--color-danger)' }}
            title="Delete Playlist"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>

      {/* Track List Table */}
      {playlist.tracks.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-faint)' }}>
          <h3 style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            This playlist is empty
          </h3>
          <p style={{ fontSize: '13px' }}>
            Search for songs or browse the Discover page and choose "Add to Playlist" from any track's menu.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 52px 1fr 200px 70px 70px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--color-text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--color-border-subtle)'
          }}>
            <span style={{ textAlign: 'center' }}>#</span>
            <span />
            <span>Title</span>
            <span>Album</span>
            <span style={{ textAlign: 'right' }}>Time</span>
            <span />
          </div>

          {playlist.tracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              isLiked={likedTrackIds.has(track.id)}
              onPlay={onPlayTrack}
              onToggleLike={onToggleLike}
              onContextMenu={onContextMenu}
              onArtistClick={onArtistClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
