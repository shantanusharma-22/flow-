import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic,
  Heart,
  ChevronDown,
  Sparkles,
  Download
} from 'lucide-react';
import { Track, RepeatMode } from '../types';
import { ScrubBar } from '../components/ScrubBar';
import { SyncedLyrics } from '../components/SyncedLyrics';
import { QueueDrawer } from '../components/QueueDrawer';

interface NowPlayingScreenProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  isLiked: boolean;
  isDownloaded: boolean;
  queue: Track[];
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleLike: () => void;
  onToggleDownload: () => void;
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
  onMoveQueueItem: (fromIdx: number, toIdx: number) => void;
}

export const NowPlayingScreen: React.FC<NowPlayingScreenProps> = ({
  currentTrack,
  isPlaying,
  currentTimeSec,
  durationSec,
  volume,
  repeatMode,
  isShuffle,
  isLiked,
  isDownloaded,
  queue,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCycleRepeat,
  onToggleShuffle,
  onToggleLike,
  onToggleDownload,
  onClose,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
  onMoveQueueItem
}) => {
  const [activeSidePanel, setActiveSidePanel] = useState<'lyrics' | 'queue' | 'none'>('lyrics');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(8, 11, 18, 0.96)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      zIndex: 110,
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6)',
      overflow: 'hidden'
    }}>
      {/* Dynamic Ambient Artwork Glow in expanded player */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '60vw',
        height: '60vh',
        borderRadius: '50%',
        background: currentTrack.accentColor || '#00e5ff',
        filter: 'blur(160px)',
        opacity: 0.22,
        pointerEvents: 'none'
      }} />

      {/* Top Header in Expanded Player */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, marginBottom: '20px' }}>
        <button className="btn-icon" onClick={onClose} aria-label="Minimize Player">
          <ChevronDown size={28} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-faint)', fontWeight: 600 }}>
            Playing from
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            {currentTrack.album || 'Flow Master Stream'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={() => setActiveSidePanel(activeSidePanel === 'lyrics' ? 'none' : 'lyrics')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderColor: activeSidePanel === 'lyrics' ? 'var(--color-accent)' : undefined,
              color: activeSidePanel === 'lyrics' ? 'var(--color-accent)' : undefined
            }}
          >
            <Mic2 size={14} />
            <span>Lyrics</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => setActiveSidePanel(activeSidePanel === 'queue' ? 'none' : 'queue')}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderColor: activeSidePanel === 'queue' ? 'var(--color-accent)' : undefined,
              color: activeSidePanel === 'queue' ? 'var(--color-accent)' : undefined
            }}
          >
            <ListMusic size={14} />
            <span>Queue</span>
          </button>
        </div>
      </div>

      {/* Main Body (Artwork & Controls on Left, Lyrics/Queue on Right) */}
      <div style={{ flex: 1, display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center', zIndex: 10, minHeight: 0 }}>
        {/* Left Column: Big Artwork & Full Controls */}
        <div style={{
          flex: 1,
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Big Artwork */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Track Details & Actions */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {currentTrack.title}
                </h1>
                {currentTrack.audioFormat === 'flac' && (
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: 'var(--color-success)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    fontWeight: 700
                  }}>
                    FLAC 24-BIT
                  </span>
                )}
              </div>
              <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {currentTrack.artist}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn-icon"
                onClick={onToggleLike}
                style={{ padding: '10px' }}
                aria-label="Like Track"
              >
                <Heart
                  size={24}
                  style={{
                    color: isLiked ? 'var(--color-danger)' : 'var(--color-text-faint)',
                    fill: isLiked ? 'var(--color-danger)' : 'none'
                  }}
                />
              </button>

              <button
                className="btn-icon"
                onClick={onToggleDownload}
                style={{ padding: '10px' }}
                aria-label="Download Track"
              >
                <Download
                  size={22}
                  style={{ color: isDownloaded ? 'var(--color-accent)' : 'var(--color-text-faint)' }}
                />
              </button>
            </div>
          </div>

          {/* Scrub Bar */}
          <div style={{ width: '100%' }}>
            <ScrubBar
              currentTimeSec={currentTimeSec}
              durationSec={durationSec}
              onSeek={onSeek}
            />
          </div>

          {/* Transport Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <button
              className="btn-icon"
              onClick={onToggleShuffle}
              style={{ color: isShuffle ? 'var(--color-accent)' : undefined }}
            >
              <Shuffle size={20} />
            </button>

            <button className="btn-icon" onClick={onPrev}>
              <SkipBack size={26} />
            </button>

            <button
              className="btn-play-pause"
              style={{ width: '56px', height: '56px' }}
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause size={28} fill="#080b12" /> : <Play size={28} fill="#080b12" style={{ marginLeft: '4px' }} />}
            </button>

            <button className="btn-icon" onClick={onNext}>
              <SkipForward size={26} />
            </button>

            <button
              className="btn-icon"
              onClick={onCycleRepeat}
              style={{ color: repeatMode !== 'off' ? 'var(--color-accent)' : undefined }}
            >
              {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
            </button>
          </div>
        </div>

        {/* Right Column: Synced Lyrics or Queue Drawer */}
        {activeSidePanel !== 'none' && (
          <div style={{
            flex: 1,
            height: '100%',
            maxWidth: '560px',
            background: 'rgba(17, 24, 39, 0.65)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {activeSidePanel === 'lyrics' ? (
              <SyncedLyrics
                track={currentTrack}
                currentTimeSec={currentTimeSec}
                onSeek={onSeek}
              />
            ) : (
              <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px' }}>
                  Up Next in Session
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {queue.map((t, idx) => (
                    <div
                      key={`${t.id}-${idx}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer'
                      }}
                      onClick={() => onPlayTrack(t)}
                    >
                      <img src={t.thumbnailUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {t.artist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
