import React, { useState, useRef } from 'react';

interface ScrubBarProps {
  currentTimeSec: number;
  durationSec: number;
  onSeek: (positionSec: number) => void;
}

export const ScrubBar: React.FC<ScrubBarProps> = ({
  currentTimeSec,
  durationSec,
  onSeek
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = durationSec > 0 ? Math.min(100, (currentTimeSec / durationSec) * 100) : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || durationSec <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(pos * durationSec);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || durationSec <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pos * durationSec);
  };

  return (
    <div className="scrub-wrapper">
      <span className="time-label current">{formatTime(currentTimeSec)}</span>
      <div
        ref={trackRef}
        className="scrub-track"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setHoverTime(null);
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        role="slider"
        aria-label="Playback Progress"
        aria-valuemin={0}
        aria-valuemax={durationSec}
        aria-valuenow={currentTimeSec}
      >
        <div className="scrub-progress" style={{ width: `${progressPercent}%` }}>
          <div className="scrub-thumb" />
        </div>

        {isHovering && hoverTime !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: `${(hoverTime / durationSec) * 100}%`,
              transform: 'translateX(-50%)',
              background: '#040711',
              color: 'var(--color-text)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--color-border)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <span className="time-label">{formatTime(durationSec)}</span>
    </div>
  );
};
