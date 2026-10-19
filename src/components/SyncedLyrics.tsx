import React, { useEffect, useRef, useState } from 'react';
import { Download, Languages, Sparkles, X } from 'lucide-react';
import { Track } from '../types';
import { StorageService } from '../services/storage';

interface SyncedLyricsProps {
  track: Track | null;
  currentTimeSec: number;
  onSeek: (seconds: number) => void;
  onClose?: () => void;
  initialRomanize?: boolean;
  initialTranslation?: boolean;
}

export const SyncedLyrics: React.FC<SyncedLyricsProps> = ({
  track,
  currentTimeSec,
  onSeek,
  onClose,
  initialRomanize = true,
  initialTranslation = true
}) => {
  const [showRomanized, setShowRomanized] = useState(initialRomanize);
  const [showTranslation, setShowTranslation] = useState(initialTranslation);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const currentTimeMs = currentTimeSec * 1000;
  const lines = track?.lyrics?.lines || [];

  // Find active line index
  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (currentTimeMs >= lines[i].startTimeMs && currentTimeMs <= (lines[i].endTimeMs || lines[i].startTimeMs + 8000)) {
      activeIndex = i;
      break;
    } else if (currentTimeMs > lines[i].startTimeMs) {
      activeIndex = i;
    }
  }

  // Smooth auto-scroll to keep active stanza centered
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  if (!track || !track.lyrics || lines.length === 0) {
    return (
      <div className="lyrics-container" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-text-faint)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={36} style={{ opacity: 0.4 }} />
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>No Synchronized Lyrics Available</h3>
          <p style={{ maxWidth: '320px', fontSize: '13px' }}>
            We could not find verified LRC timestamps for this track. Enjoy the instrumental sound!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lyrics-container">
      {/* Header with Toolbars & Differentiator Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4) var(--space-3)',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
            Synchronized Lyrics
          </span>
          <span style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(0, 229, 255, 0.12)',
            color: 'var(--color-accent)'
          }}>
            {track.lyrics.provider || 'Flow Synced Engine'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Fix #364 & #439: Phonetic Romanization Toggle */}
          <button
            className="btn-secondary"
            onClick={() => setShowRomanized(!showRomanized)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              borderColor: showRomanized ? 'var(--color-accent)' : undefined,
              color: showRomanized ? 'var(--color-accent)' : undefined
            }}
            title="Toggle Phonetic Romanization (Romaji / Hangul - Fix #364)"
          >
            <Languages size={13} />
            <span>Romaji</span>
          </button>

          {/* Dual-line Translation Toggle */}
          <button
            className="btn-secondary"
            onClick={() => setShowTranslation(!showTranslation)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              borderColor: showTranslation ? 'var(--color-accent-violet)' : undefined,
              color: showTranslation ? 'var(--color-accent-violet)' : undefined
            }}
            title="Toggle English Lyrics Translation"
          >
            <span>Translate</span>
          </button>

          {/* Fix #909: Export .lrc file */}
          <button
            className="btn-secondary"
            onClick={() => StorageService.exportLrcFile(track)}
            style={{ padding: '4px 10px', fontSize: '11px' }}
            title="Export .lrc file to local disk (Fix #909)"
          >
            <Download size={13} />
            <span>Save .LRC</span>
          </button>

          {onClose && (
            <button className="btn-icon" onClick={onClose} aria-label="Close Lyrics View">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Auto-scrolling Lyrics Stanzas */}
      <div className="lyrics-scroll-area" ref={scrollRef}>
        {lines.map((line, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`lyric-stanza ${isActive ? 'active' : ''}`}
              onClick={() => onSeek(line.startTimeMs / 1000)}
              title="Click to jump to this timestamp"
            >
              <div>{line.text}</div>
              {showRomanized && line.romanized && (
                <div className="lyric-subtext">{line.romanized}</div>
              )}
              {showTranslation && line.translation && (
                <div className="lyric-translation">"{line.translation}"</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
