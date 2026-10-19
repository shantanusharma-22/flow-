import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  MoreHorizontal,
  Volume1,
  Volume2,
  Music,
  Headphones,
  User,
  ListMusic,
  MessageSquare,
  Globe,
  Languages
} from 'lucide-react';
import { Track, RepeatMode } from '../types';

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
  isLiked,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleLike,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'controls' | 'lyrics'>('controls');

  const formatTime = (sec: number) => {
    const mins = Math.floor(Math.abs(sec) / 60);
    const secs = Math.floor(Math.abs(sec) % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingSec = Math.max(0, durationSec - currentTimeSec);
  const progressPercent = durationSec > 0 ? Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100)) : 0;

  const currentMs = currentTimeSec * 1000;
  const lines = currentTrack.lyrics?.lines || [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0a0d14',
        overflow: 'hidden',
        color: '#ffffff',
        padding: '24px 48px 28px 48px'
      }}
    >
      {/* Dynamic Dual Plum-Emerald Ambient Mesh Backdrop (Matching Screenshots 4 & 5) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '70vw',
          height: '70vh',
          borderRadius: '50%',
          backgroundColor: '#701a75',
          opacity: 0.28,
          filter: 'blur(160px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '70vw',
          height: '70vh',
          borderRadius: '50%',
          backgroundColor: '#064e3b',
          opacity: 0.28,
          filter: 'blur(160px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Floating Drag Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
        <div
          onClick={onClose}
          title="Close player (Esc)"
          style={{
            width: '44px',
            height: '4px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.75)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)')}
        />
      </div>

      {/* Main 2-Column Content Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '70px',
          flex: 1,
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Left: Album Artwork (Square with rounded corners) */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={currentTrack.thumbnailUrl}
            alt={currentTrack.title}
            style={{
              width: viewMode === 'controls' ? '380px' : '360px',
              height: viewMode === 'controls' ? '380px' : '360px',
              borderRadius: '16px',
              objectFit: 'cover',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Right: Now Playing Controls (Screenshot 4) OR Synced Lyrics (Screenshot 5) */}
        {viewMode === 'controls' ? (
          <div
            style={{
              flex: 1,
              maxWidth: '460px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Header: Playing from Recents */}
            <span
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontWeight: 600,
                letterSpacing: '0.04em'
              }}
            >
              Playing from Recents
            </span>

            {/* Song Title, Artist & Like/Options Buttons */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15
                  }}
                >
                  {currentTrack.title}
                </h1>
                <span
                  style={{
                    fontSize: '15px',
                    color: '#94a3b8',
                    fontWeight: 500,
                    marginTop: '4px'
                  }}
                >
                  {currentTrack.artist}
                </span>
              </div>

              {/* Heart (Like) & Options Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={onToggleLike}
                  title="Like song"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isLiked ? '#ef4444' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} />
                </button>

                <button
                  onClick={() => alert(`Track options for: ${currentTrack.title}`)}
                  title="More actions"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Lyrics Link Button */}
            <div>
              <button
                onClick={() => setViewMode('lyrics')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
              >
                <Music size={15} />
                <span>Lyrics</span>
                <span style={{ fontSize: '13px', marginLeft: '2px' }}>&gt;</span>
              </button>
            </div>

            {/* Scrub Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  onSeek(ratio * durationSec);
                }}
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Timestamps & Quality Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: '#94a3b8',
                  fontWeight: 600
                }}
              >
                <span>{formatTime(currentTimeSec)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e2e8f0' }}>
                  <Headphones size={12} />
                  <span>High quality</span>
                </span>
                <span>-{formatTime(remainingSec)}</span>
              </div>
            </div>

            {/* Big Playback Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '36px',
                marginTop: '12px'
              }}
            >
              <button
                onClick={onPrev}
                title="Previous track"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SkipBack size={32} fill="#ffffff" />
              </button>

              <button
                onClick={onPlayPause}
                title={isPlaying ? 'Pause' : 'Play'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                {isPlaying ? (
                  <Pause size={28} fill="#000000" color="#000000" />
                ) : (
                  <Play size={28} fill="#000000" color="#000000" style={{ marginLeft: '4px' }} />
                )}
              </button>

              <button
                onClick={onNext}
                title="Next track"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SkipForward size={32} fill="#ffffff" />
              </button>
            </div>

            {/* Volume Slider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '12px'
              }}
            >
              <Volume1 size={17} style={{ color: '#94a3b8' }} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                style={{
                  width: '260px',
                  height: '4px',
                  accentColor: '#ffffff',
                  cursor: 'pointer'
                }}
              />
              <Volume2 size={17} style={{ color: '#94a3b8' }} />
            </div>
          </div>
        ) : (
          /* Synced Lyrics View (Screenshot 5) */
          <div
            style={{
              flex: 1,
              maxWidth: '520px',
              height: '460px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Scrollable Apple-Style Synced Lyrics Column */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '12px'
              }}
            >
              {lines.length > 0 ? (
                lines.map((l, idx) => {
                  const isActive = currentMs >= l.startTimeMs && currentMs < l.endTimeMs;
                  return (
                    <div
                      key={idx}
                      onClick={() => onSeek(l.startTimeMs / 1000)}
                      style={{
                        fontSize: isActive ? '28px' : '22px',
                        fontWeight: 800,
                        color: '#ffffff',
                        opacity: isActive ? 1 : 0.38,
                        cursor: 'pointer',
                        lineHeight: 1.35,
                        transition: 'all 0.25s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.opacity = '0.7';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.opacity = '0.38';
                      }}
                    >
                      {l.text}
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: '20px', color: '#94a3b8', fontStyle: 'italic', marginTop: '60px' }}>
                  No synced lyrics available for this song.
                </div>
              )}
            </div>

            {/* Bottom Lyrics Footer (Matching Screenshot 5) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                title="Language selection"
              >
                <Globe size={18} />
              </button>

              <span
                onClick={() => setViewMode('controls')}
                style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Lyrics by YouTube Music
              </span>

              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                title="Phonetic Translation"
              >
                <Languages size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Modal Toolbar (Matching Screenshots 4 & 5) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Toggle Lyrics/Speech Bubble Icon */}
        <button
          onClick={() => setViewMode(viewMode === 'controls' ? 'lyrics' : 'controls')}
          title="Toggle Lyrics"
          style={{
            background: 'none',
            border: 'none',
            color: viewMode === 'lyrics' ? '#ffffff' : '#94a3b8',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <MessageSquare size={20} />
        </button>

        {/* Center Pill: Headphones | Profile with 'Harrmane's Phone' underneath */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Headphones size={15} style={{ color: '#ffffff' }} />
            <div style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <User size={15} style={{ color: '#ffffff' }} />
          </div>
          <span style={{ fontSize: '11px', color: '#8c92a4', fontWeight: 600 }}>Harrmane's Phone</span>
        </div>

        {/* Queue Drawer Icon */}
        <button
          onClick={onClose}
          title="Close player"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <ListMusic size={20} />
        </button>
      </div>
    </div>
  );
};
