import React from 'react';
import { Heart, ExternalLink, X, Code, Music, Sparkles } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LYRICS_PROVIDERS = [
  { name: 'LRCLIB', url: 'https://lrclib.net/', desc: 'Community-driven open lyrics database' },
  { name: 'lrc.red', url: 'https://lrc.red/', desc: 'High-precision synced LRC engine' },
  { name: 'binimum / am-lyrics', url: 'https://github.com/binimum/am-lyrics', desc: 'Apple Music-style fluid lyrics animation' },
  { name: 'BiniLyrics', url: 'https://github.com/binimum', desc: 'Syllable-timed lyrics provider' },
  { name: 'BetterLyrics', url: 'https://github.com/better-lyrics/better-lyrics', desc: 'Multi-source lyrics aggregator' },
  { name: 'PaxSenix', url: 'https://lyrics.paxsenix.org/', desc: 'Word-synced lyrics endpoint' },
  { name: 'LyricsPlus', url: 'https://github.com/ibratabian17/YouLyPlus', desc: 'Dynamic Asian phonetic transliteration' },
  { name: 'SimpMusic', url: 'https://github.com/maxrave-dev/SimpMusic', desc: 'Open-source audio client architecture' },
  { name: 'Unison', url: 'https://unison.boidu.dev/', desc: 'Party sync listening coordinator' },
  { name: 'Megalobiz', url: 'https://www.megalobiz.com/', desc: 'Time-tagged community LRC repository' },
  { name: 'KuGou', url: 'https://www.kugou.com/', desc: 'Hi-Res lyrics catalog' },
  { name: 'Musixmatch', url: 'https://www.musixmatch.com/', desc: 'Global verified lyrics database' },
  { name: 'Genius', url: 'https://genius.com/', desc: 'Crowdsourced musical knowledge & annotations' }
];

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.75)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        background: 'var(--color-surface-elevated, #111827)',
        border: '1px solid var(--color-border, #1f293d)',
        borderRadius: '16px',
        padding: '28px',
        width: '640px',
        maxWidth: '92vw',
        maxHeight: '85vh',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle, #1a2234)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e'
            }}>
              <Heart size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', margin: 0 }}>
                Credits & Open-Source Acknowledgments
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', margin: '2px 0 0' }}>
                Honoring the developers and community APIs powering Flow
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Close Credits">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '6px' }}>
          {/* Lyrics Animation Feature Credit */}
          <div style={{
            background: 'var(--color-surface, #0b101b)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-subtle, #1a2234)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--color-accent, #00e5ff)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
                Apple-like Fluid Lyrics Animation
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', margin: '0 0 10px', lineHeight: 1.5 }}>
              The fluid typography, active stanza focus zoom, and auto-scrolling synchronization are inspired by the stellar open-source work of <strong>binimum</strong> in <code>am-lyrics</code>.
            </p>
            <a
              href="https://github.com/binimum/am-lyrics"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '12px',
                color: 'var(--color-accent, #00e5ff)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500
              }}
            >
              github.com/binimum/am-lyrics <ExternalLink size={12} />
            </a>
          </div>

          {/* Lyrics Providers Grid */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music size={15} color="var(--color-accent-violet, #a855f7)" />
              <span>Multi-Source Lyrics Providers & Aggregators</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {LYRICS_PROVIDERS.map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'var(--color-surface, #0b101b)',
                    border: '1px solid var(--color-border-subtle, #1a2234)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent, #00e5ff)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-subtle, #1a2234)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
                      {p.name}
                    </span>
                    <ExternalLink size={12} color="var(--color-text-faint, #64748b)" />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary, #94a3b8)', marginTop: '4px' }}>
                    {p.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Engine & Architecture Attribution */}
          <div style={{
            background: 'var(--color-surface, #0b101b)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--color-border-subtle, #1a2234)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Code size={16} color="#10b981" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
                Clean-Room Desktop Engineering
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', margin: 0, lineHeight: 1.5 }}>
              Engineered with React 19, TypeScript, and high-performance native SQLite WAL database. 100% Free, zero ads, zero tracking, and zero telemetry collection.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-subtle, #1a2234)', paddingTop: '14px' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '8px 24px', fontSize: '13px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
