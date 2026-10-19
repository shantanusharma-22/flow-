import React from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Track } from '../types';

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  isLiked?: boolean;
  onPlay: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onContextMenu: (e: React.MouseEvent, track: Track) => void;
  onArtistClick?: (artistId: string) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isActive,
  isPlaying,
  isLiked,
  onPlay,
  onToggleLike,
  onContextMenu,
  onArtistClick
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={`track-row ${isActive ? 'active' : ''}`}
      onDoubleClick={() => onPlay(track)}
    >
      {/* Index or Equalizer */}
      <div className="track-index">
        {isActive && isPlaying ? (
          <div className="eq-container" style={{ margin: '0 auto' }}>
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
          </div>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      {/* Artwork Box with Play Overlay */}
      <div className="track-thumb-box" onClick={() => onPlay(track)}>
        <img
          src={track.thumbnailUrl}
          alt={track.title}
          className="track-thumb-img"
          loading="lazy"
        />
        <div className="track-play-overlay">
          {isActive && isPlaying ? (
            <Pause size={18} fill="#ffffff" />
          ) : (
            <Play size={18} fill="#ffffff" style={{ marginLeft: '2px' }} />
          )}
        </div>
      </div>

      {/* Title & Artist */}
      <div className="track-title-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="track-row-title">{track.title}</span>
          {track.audioFormat === 'flac' && (
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 4px',
              borderRadius: '2px',
              background: 'rgba(52, 211, 153, 0.15)',
              color: 'var(--color-success)',
              fontWeight: 700
            }}>
              FLAC
            </span>
          )}
        </div>
        <span
          className="track-row-artist"
          onClick={(e) => {
            if (track.artistId && onArtistClick) {
              e.stopPropagation();
              onArtistClick(track.artistId);
            }
          }}
          style={{ cursor: track.artistId ? 'pointer' : 'default' }}
        >
          {track.artist}
        </span>
      </div>

      {/* Album */}
      <div className="track-album">
        {track.album || 'Single'}
      </div>

      {/* Duration */}
      <div className="track-duration">
        {formatTime(track.durationSec)}
      </div>

      {/* Action Buttons: Like + More */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
        <button
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track.id);
          }}
          style={{ padding: '6px' }}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={16}
            style={{
              color: isLiked ? 'var(--color-danger)' : 'var(--color-text-faint)',
              fill: isLiked ? 'var(--color-danger)' : 'none'
            }}
          />
        </button>

        <button
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, track);
          }}
          style={{ padding: '6px' }}
          aria-label="More actions"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};
