import React, { useEffect, useRef } from 'react';
import {
  Play,
  ListPlus,
  Heart,
  Download,
  FileText,
  User,
  Plus
} from 'lucide-react';
import { Track, Playlist } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  track: Track;
  playlists: Playlist[];
  isLiked: boolean;
  isDownloaded: boolean;
  onClose: () => void;
  onPlayNow: (track: Track) => void;
  onPlayNext: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onAddToPlaylist: (playlistId: string, track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onToggleDownload: (trackId: string) => void;
  onExportLrc: (track: Track) => void;
  onGoToArtist?: (artistId: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  track,
  playlists,
  isLiked,
  isDownloaded,
  onClose,
  onPlayNow,
  onPlayNext,
  onAddToQueue,
  onAddToPlaylist,
  onToggleLike,
  onToggleDownload,
  onExportLrc,
  onGoToArtist
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Adjust coordinates to prevent clipping viewport edge
  const adjustedX = Math.min(x, window.innerWidth - 240);
  const adjustedY = Math.min(y, window.innerHeight - 380);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        width: '230px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        zIndex: 200,
        boxShadow: 'var(--shadow-popover)'
      }}
      role="menu"
    >
      <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '4px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.artist}
        </div>
      </div>

      <button
        className="nav-item"
        onClick={() => { onPlayNow(track); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <Play size={14} style={{ color: 'var(--color-accent)' }} />
        <span>Play Now</span>
      </button>

      <button
        className="nav-item"
        onClick={() => { onPlayNext(track); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <ListPlus size={14} />
        <span>Play Next</span>
      </button>

      <button
        className="nav-item"
        onClick={() => { onAddToQueue(track); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <ListPlus size={14} />
        <span>Add to Queue</span>
      </button>

      <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '4px 0' }} />

      <button
        className="nav-item"
        onClick={() => { onToggleLike(track.id); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <Heart size={14} style={{ color: isLiked ? 'var(--color-danger)' : undefined, fill: isLiked ? 'var(--color-danger)' : 'none' }} />
        <span>{isLiked ? 'Remove from Liked' : 'Save to Liked Songs'}</span>
      </button>

      <button
        className="nav-item"
        onClick={() => { onToggleDownload(track.id); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <Download size={14} style={{ color: isDownloaded ? 'var(--color-accent)' : undefined }} />
        <span>{isDownloaded ? 'Delete Offline Cache' : 'Download for Offline'}</span>
      </button>

      {/* Fix #909: Export LRC */}
      <button
        className="nav-item"
        onClick={() => { onExportLrc(track); onClose(); }}
        style={{ padding: '6px 8px' }}
      >
        <FileText size={14} />
        <span>Export .LRC Lyrics (Fix #909)</span>
      </button>

      {track.artistId && onGoToArtist && (
        <button
          className="nav-item"
          onClick={() => { onGoToArtist(track.artistId!); onClose(); }}
          style={{ padding: '6px 8px' }}
        >
          <User size={14} />
          <span>View Artist Profile</span>
        </button>
      )}

      {/* Add to Playlist Sub-section */}
      {playlists.length > 0 && (
        <>
          <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '4px 0' }} />
          <div style={{ fontSize: '10px', color: 'var(--color-text-faint)', padding: '4px 8px', textTransform: 'uppercase' }}>
            Add to Playlist
          </div>
          {playlists.slice(0, 4).map(pl => (
            <button
              key={pl.id}
              className="nav-item"
              onClick={() => { onAddToPlaylist(pl.id, track); onClose(); }}
              style={{ padding: '5px 8px', fontSize: '12px' }}
            >
              <Plus size={12} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.title}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
};
