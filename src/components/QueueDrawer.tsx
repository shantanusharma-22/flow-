import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, Radio, Sparkles } from 'lucide-react';
import { Track } from '../types';

interface QueueDrawerProps {
  currentTrack: Track | null;
  queue: Track[];
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  onMoveQueueItem: (fromIdx: number, toIdx: number) => void;
  autoplayEnabled: boolean;
  onToggleAutoplay: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  currentTrack,
  queue,
  onClose,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
  onMoveQueueItem,
  autoplayEnabled,
  onToggleAutoplay
}) => {
  return (
    <aside className="queue-drawer" aria-label="Playback Queue">
      <div className="queue-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
            Playing Queue
          </span>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-secondary)'
          }}>
            {queue.length} upcoming
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {queue.length > 0 && (
            <button
              className="btn-icon"
              onClick={onClearQueue}
              title="Clear upcoming queue"
              aria-label="Clear queue"
            >
              <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
            </button>
          )}
          <button className="btn-icon" onClick={onClose} aria-label="Close queue drawer">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="queue-list">
        {/* Currently Playing Card */}
        {currentTrack && (
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Now Playing
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              marginTop: '6px'
            }}>
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {currentTrack.artist}
                </div>
              </div>
              <Sparkles size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Autoplay / Infinite Radio Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={15} style={{ color: autoplayEnabled ? 'var(--color-accent)' : 'var(--color-text-faint)' }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Autoplay Similar Music</span>
          </div>
          <button
            className="btn-secondary"
            onClick={onToggleAutoplay}
            style={{
              padding: '2px 8px',
              fontSize: '11px',
              borderColor: autoplayEnabled ? 'var(--color-accent)' : undefined,
              color: autoplayEnabled ? 'var(--color-accent)' : undefined
            }}
          >
            {autoplayEnabled ? 'Enabled' : 'Off'}
          </button>
        </div>

        {/* Up Next List */}
        <span style={{ fontSize: '11px', color: 'var(--color-text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
          Up Next
        </span>

        {queue.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--color-text-faint)', fontSize: '13px' }}>
            Your queue is empty. Queue songs by clicking their "..." menu.
          </div>
        ) : (
          queue.map((track, idx) => (
            <div
              key={`${track.id}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                transition: 'background 0.15s ease'
              }}
            >
              <img
                src={track.thumbnailUrl}
                alt={track.title}
                style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => onPlayTrack(track)}
              />

              <div
                style={{ flex: 1, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => onPlayTrack(track)}
              >
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.title}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {track.artist}
                </div>
              </div>

              {/* Reorder Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => onMoveQueueItem(idx, idx - 1)}
                  style={{ padding: '4px', opacity: idx === 0 ? 0.3 : 1 }}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  className="btn-icon"
                  disabled={idx === queue.length - 1}
                  onClick={() => onMoveQueueItem(idx, idx + 1)}
                  style={{ padding: '4px', opacity: idx === queue.length - 1 ? 0.3 : 1 }}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => onRemoveFromQueue(idx)}
                  style={{ padding: '4px' }}
                  title="Remove from queue"
                >
                  <X size={14} style={{ color: 'var(--color-danger)' }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
