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
  Maximize2,
  Download,
  Gauge
} from 'lucide-react';
import { Track, RepeatMode } from '../types';
import { ScrubBar } from './ScrubBar';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  playbackSpeed: number;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isLiked: boolean;
  isDownloaded: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onToggleLike: () => void;
  onToggleDownload: () => void;
  onOpenNowPlaying: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTimeSec,
  durationSec,
  volume,
  repeatMode,
  isShuffle,
  playbackSpeed,
  isLyricsOpen,
  isQueueOpen,
  isLiked,
  isDownloaded,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCycleRepeat,
  onToggleShuffle,
  onChangeSpeed,
  onToggleLyrics,
  onToggleQueue,
  onToggleLike,
  onToggleDownload,
  onOpenNowPlaying
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  if (!currentTrack) {
    return (
      <footer className="player-bar" role="region" aria-label="Audio Player">
        <div style={{ color: 'var(--color-text-faint)', fontSize: '13px' }}>
          Select a song or playlist to start listening
        </div>
        <div />
        <div />
      </footer>
    );
  }

  return (
    <footer className="player-bar" role="region" aria-label="Audio Player">
      {/* Left Column: Track Info */}
      <div className="player-track-info" onClick={onOpenNowPlaying} title="Click to expand Now Playing">
        <img
          src={currentTrack.thumbnailUrl}
          alt={currentTrack.title}
          className="player-artwork"
        />
        <div className="player-text-details">
          <span className="player-title">{currentTrack.title}</span>
          <span className="player-artist">{currentTrack.artist}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '6px' }} onClick={(e) => e.stopPropagation()}>
          <button
            className="btn-icon"
            onClick={onToggleLike}
            aria-label={isLiked ? 'Unlike song' : 'Like song'}
            title={isLiked ? 'In your Liked Songs' : 'Add to Liked Songs'}
          >
            <Heart
              size={18}
              style={{
                color: isLiked ? 'var(--color-danger)' : 'var(--color-text-faint)',
                fill: isLiked ? 'var(--color-danger)' : 'none'
              }}
            />
          </button>
          <button
            className="btn-icon"
            onClick={onToggleDownload}
            aria-label="Download for offline listening"
            title={isDownloaded ? 'Downloaded to local storage' : 'Download track (Fix #904)'}
          >
            <Download
              size={17}
              style={{
                color: isDownloaded ? 'var(--color-accent)' : 'var(--color-text-faint)'
              }}
            />
          </button>
        </div>
      </div>

      {/* Center Column: Controls + ScrubBar */}
      <div className="player-controls-container">
        <div className="player-buttons-row">
          <button
            className="btn-icon"
            onClick={onToggleShuffle}
            style={{ color: isShuffle ? 'var(--color-accent)' : undefined }}
            title={`Shuffle: ${isShuffle ? 'On' : 'Off'}`}
          >
            <Shuffle size={17} />
          </button>

          <button className="btn-icon" onClick={onPrev} title="Previous (Left Arrow)">
            <SkipBack size={19} />
          </button>

          <button
            className="btn-play-pause"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
          >
            {isPlaying ? <Pause size={20} fill="#080b12" /> : <Play size={20} fill="#080b12" style={{ marginLeft: '2px' }} />}
          </button>

          <button className="btn-icon" onClick={onNext} title="Next (Right Arrow)">
            <SkipForward size={19} />
          </button>

          {/* 3-State Loop Button (Fix #900) */}
          <button
            className="btn-icon"
            onClick={onCycleRepeat}
            style={{
              color: repeatMode !== 'off' ? 'var(--color-accent)' : undefined,
              position: 'relative'
            }}
            title={`Repeat mode: ${repeatMode.toUpperCase()} (Click to toggle Off -> All -> One)`}
          >
            {repeatMode === 'one' ? <Repeat1 size={19} /> : <Repeat size={19} />}
          </button>
        </div>

        <ScrubBar
          currentTimeSec={currentTimeSec}
          durationSec={durationSec}
          onSeek={onSeek}
        />
      </div>

      {/* Right Column: Speed, Lyrics, Queue, Volume */}
      <div className="player-right-actions">
        {/* Playback Speed Menu (Fix #890) */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: playbackSpeed !== 1.0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              gap: '2px'
            }}
            title="Playback Speed (Pitch Preserved)"
          >
            <Gauge size={15} />
            <span>{playbackSpeed}x</span>
          </button>

          {showSpeedMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: '44px',
                right: '0',
                background: 'rgba(17, 24, 39, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 120,
                boxShadow: 'var(--shadow-popover)'
              }}
            >
              <div style={{ fontSize: '10px', color: 'var(--color-text-faint)', padding: '4px 8px', textTransform: 'uppercase' }}>
                Playback Speed
              </div>
              {speeds.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    onChangeSpeed(s);
                    setShowSpeedMenu(false);
                  }}
                  style={{
                    background: playbackSpeed === s ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                    color: playbackSpeed === s ? 'var(--color-accent)' : 'var(--color-text)',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    textAlign: 'left'
                  }}
                >
                  {s}x {s === 1.0 ? '(Normal)' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Synced Lyrics Toggle */}
        <button
          className="btn-icon"
          onClick={onToggleLyrics}
          style={{
            color: isLyricsOpen ? 'var(--color-accent)' : undefined,
            background: isLyricsOpen ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
          title="Synchronized Lyrics (S04)"
          aria-label="Toggle Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Drawer Toggle */}
        <button
          className="btn-icon"
          onClick={onToggleQueue}
          style={{
            color: isQueueOpen ? 'var(--color-accent)' : undefined,
            background: isQueueOpen ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
          title="Up Next Queue (S05)"
          aria-label="Toggle Queue"
        >
          <ListMusic size={19} />
        </button>

        {/* Volume Slider */}
        <div className="volume-slider-wrapper">
          <button className="btn-icon" onClick={onToggleMute} title="Mute/Unmute">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="volume-range"
            aria-label="Volume level"
          />
        </div>

        {/* Expand Now Playing Button */}
        <button
          className="btn-icon"
          onClick={onOpenNowPlaying}
          title="Expanded Player (S03)"
          aria-label="Expand Player"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </footer>
  );
};
