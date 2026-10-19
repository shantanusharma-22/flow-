import React, { useState, useEffect } from 'react';
import { Activity, X, RefreshCw, Cpu, Layers, Radio, Volume2 } from 'lucide-react';
import { audioPlayer, StatsForNerds } from '../services/audioPlayer';

interface StatsForNerdsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsForNerdsModal: React.FC<StatsForNerdsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsForNerds>(audioPlayer.getStatsForNerds());

  useEffect(() => {
    if (!isOpen) return;

    setStats(audioPlayer.getStatsForNerds());
    const interval = setInterval(() => {
      setStats(audioPlayer.getStatsForNerds());
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTrack = audioPlayer.getCurrentTrack();

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
        padding: '24px 28px',
        width: '540px',
        maxWidth: '92vw',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'var(--font-sans, system-ui)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle, #1a2234)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(0, 229, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent, #00e5ff)'
            }}>
              <Activity size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', margin: 0 }}>
                Stats for Nerds (Audio Telemetry)
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary, #94a3b8)', margin: '1px 0 0' }}>
                Real-time audio processing pipeline and hardware output diagnostics
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Close Stats">
            <X size={18} />
          </button>
        </div>

        {/* Current Track Summary */}
        {currentTrack && (
          <div style={{
            background: 'var(--color-surface, #0b101b)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid var(--color-border-subtle, #1a2234)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img
              src={currentTrack.thumbnailUrl}
              alt=""
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentTrack.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary, #94a3b8)' }}>
                {currentTrack.artist} • {currentTrack.album || 'Flow Hi-Res Master'}
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          background: 'var(--color-surface, #0b101b)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--color-border-subtle, #1a2234)',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Audio Codec</span>
            <div style={{ color: 'var(--color-accent, #00e5ff)', fontWeight: 600, marginTop: '2px' }}>{stats.codec}</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Nominal Bitrate</span>
            <div style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, marginTop: '2px' }}>{stats.bitrateKbps} kbps</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Sample Rate</span>
            <div style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, marginTop: '2px' }}>{(stats.sampleRate / 1000).toFixed(1)} kHz</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Quantization / Depth</span>
            <div style={{ color: 'var(--color-accent-violet, #a855f7)', fontWeight: 600, marginTop: '2px' }}>{stats.bitDepth}</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Buffer Health</span>
            <div style={{ color: '#10b981', fontWeight: 600, marginTop: '2px' }}>{stats.bufferHealthSec}s cached ahead</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Audio Latency</span>
            <div style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, marginTop: '2px' }}>{stats.latencyMs} ms</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Peak Signal</span>
            <div style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, marginTop: '2px' }}>{stats.peakDb} dBFS</div>
          </div>

          <div>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Effective Tempo</span>
            <div style={{ color: 'var(--color-text, #f8fafc)', fontWeight: 600, marginTop: '2px' }}>{stats.playbackSpeed}× (Pitch Preserved)</div>
          </div>

          <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--color-border-subtle, #1a2234)', paddingTop: '8px' }}>
            <span style={{ color: 'var(--color-text-faint, #64748b)', fontSize: '10px', textTransform: 'uppercase' }}>Audio Destination Bus</span>
            <div style={{ color: 'var(--color-text-secondary, #94a3b8)', marginTop: '2px', fontSize: '11px' }}>{stats.audioOutput}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-faint, #64748b)' }}>
          <span>Telemetry refreshed every 800ms</span>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px 18px', fontSize: '12px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
