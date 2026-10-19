import React, { useState } from 'react';
import {
  ArrowLeft,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Headphones,
  MessageSquare,
  ListMusic
} from 'lucide-react';
import { Track, RepeatMode } from '../types';
import { AccountPopover } from './AccountPopover';
import { ListenTogetherModal } from './ListenTogetherModal';

interface HeaderProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onOpenNowPlaying: () => void;
  onToggleQueue: () => void;
  onOpenSettings: () => void;
  onNavigateBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTrack,
  isPlaying,
  currentTimeSec,
  durationSec,
  volume,
  isShuffle,
  repeatMode,
  onPlayPause,
  onPrev,
  onNext,
  onVolumeChange,
  onToggleShuffle,
  onCycleRepeat,
  onOpenNowPlaying,
  onToggleQueue,
  onOpenSettings,
  onNavigateBack
}) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isListenTogetherOpen, setIsListenTogetherOpen] = useState(false);

  const progressPercent = durationSec > 0 ? Math.min(100, Math.max(0, (currentTimeSec / durationSec) * 100)) : 0;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 20px',
        background: 'rgba(16, 18, 23, 0.95)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Left: Brand Icon & Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Flow Wavy Brand Logo */}
        <div
          title="Flow Music"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <img src="/flow_wave.svg" alt="Flow" style={{ width: '22px', height: '22px' }} />
        </div>

        {/* Back Button */}
        <button
          onClick={onNavigateBack}
          title="Go back"
          style={{
            background: 'none',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          title="Shuffle"
          style={{
            background: 'none',
            border: 'none',
            color: isShuffle ? 'var(--color-accent, #00e5ff)' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = isShuffle ? '#00e5ff' : '#94a3b8')}
        >
          <Shuffle size={16} />
        </button>

        {/* Previous */}
        <button
          onClick={onPrev}
          title="Previous"
          style={{
            background: 'none',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        >
          <SkipBack size={18} fill="#cbd5e1" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPlaying ? (
            <Pause size={20} fill="#ffffff" />
          ) : (
            <Play size={20} fill="#ffffff" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          title="Next"
          style={{
            background: 'none',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        >
          <SkipForward size={18} fill="#cbd5e1" />
        </button>

        {/* Repeat */}
        <button
          onClick={onCycleRepeat}
          title={`Repeat: ${repeatMode}`}
          style={{
            background: 'none',
            border: 'none',
            color: repeatMode !== 'off' ? 'var(--color-accent, #00e5ff)' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = repeatMode !== 'off' ? '#00e5ff' : '#94a3b8')}
        >
          <Repeat size={16} />
        </button>
      </div>

      {/* Center: Now Playing Capsule Card */}
      {currentTrack && (
        <div
          onClick={onOpenNowPlaying}
          title="Click to expand Now Playing & Lyrics"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '320px',
            height: '40px',
            padding: '4px 10px 4px 6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
        >
          {/* Album Artwork */}
          <img
            src={currentTrack.thumbnailUrl}
            alt={currentTrack.title}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '4px',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />

          {/* Title & Artist */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
                marginTop: '1px'
              }}
            >
              {currentTrack.artist}
            </div>
          </div>

          {/* Underneath Progress Bar Line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#ffffff',
                transition: 'width 0.2s linear'
              }}
            />
          </div>
        </div>
      )}

      {/* Right: Volume, Audio Output, Discord, Queue & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        {/* Volume Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            style={{
              width: '74px',
              height: '3px',
              accentColor: '#ffffff',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Headphones (Listen Together / Jam Session) */}
        <button
          onClick={() => setIsListenTogetherOpen(true)}
          title="Listen Together / Jam Session"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <Headphones size={17} />
        </button>

        {/* Discord / Chat */}
        <button
          onClick={() => alert('Discord Rich Presence: Connected to Discord client')}
          title="Discord Rich Presence"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <MessageSquare size={17} />
        </button>

        {/* Queue Drawer */}
        <button
          onClick={onToggleQueue}
          title="Playback Queue"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ListMusic size={17} />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setIsAccountOpen(!isAccountOpen)}
          title="Harrmane (@Harrmane)"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5bf4f'
          }}
        >
          <img src="/avatar_harrmane.svg" alt="Harrmane" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Account Popover */}
        <AccountPopover
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          onOpenSettings={onOpenSettings}
        />

        {/* Listen Together Modal */}
        <ListenTogetherModal
          isOpen={isListenTogetherOpen}
          onClose={() => setIsListenTogetherOpen(false)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlayPause={onPlayPause}
        />
      </div>
    </header>
  );
};
