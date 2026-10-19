import React, { useState, useEffect } from 'react';
import { Sliders, X, Check, RotateCcw } from 'lucide-react';
import { audioPlayer, EqualizerBands, EQUALIZER_PRESETS } from '../services/audioPlayer';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BAND_CONFIGS: { key: keyof EqualizerBands; label: string; desc: string }[] = [
  { key: 'f60', label: '60 Hz', desc: 'Sub-Bass' },
  { key: 'f170', label: '170 Hz', desc: 'Bass' },
  { key: 'f310', label: '310 Hz', desc: 'Low-Mid' },
  { key: 'f600', label: '600 Hz', desc: 'Mid' },
  { key: 'f1k', label: '1 kHz', desc: 'Mid-High' },
  { key: 'f3k', label: '3 kHz', desc: 'Presence' },
  { key: 'f6k', label: '6 kHz', desc: 'Crisp' },
  { key: 'f12k', label: '12 kHz', desc: 'Treble' }
];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const [bands, setBands] = useState<EqualizerBands>(audioPlayer.getEqualizerBands());
  const [activePreset, setActivePreset] = useState<string>(audioPlayer.getEqualizerPresetName());
  const [isEnabled, setIsEnabled] = useState<boolean>(audioPlayer.isEqualizerEnabled());

  useEffect(() => {
    if (isOpen) {
      setBands(audioPlayer.getEqualizerBands());
      setActivePreset(audioPlayer.getEqualizerPresetName());
      setIsEnabled(audioPlayer.isEqualizerEnabled());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSliderChange = (key: keyof EqualizerBands, value: number) => {
    audioPlayer.setEqualizerBand(key, value);
    setBands(audioPlayer.getEqualizerBands());
    setActivePreset('Custom');
  };

  const handleSelectPreset = (presetName: string) => {
    audioPlayer.setEqualizerPreset(presetName);
    setBands(audioPlayer.getEqualizerBands());
    setActivePreset(presetName);
  };

  const handleToggleEnable = () => {
    const next = audioPlayer.toggleEqualizer();
    setIsEnabled(next);
  };

  const handleReset = () => {
    handleSelectPreset('Flat');
  };

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
        width: '680px',
        maxWidth: '92vw',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle, #1a2234)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0, 229, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent, #00e5ff)'
            }}>
              <Sliders size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', margin: 0 }}>
                8-Band Parametric Equalizer
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', margin: '2px 0 0' }}>
                Hardware-accelerated Web Audio biquad curve filters with lossless phase accuracy
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleToggleEnable}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isEnabled ? 'rgba(0, 229, 255, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                color: isEnabled ? 'var(--color-accent, #00e5ff)' : 'var(--color-text-secondary, #94a3b8)',
                cursor: 'pointer'
              }}
            >
              {isEnabled ? '● EQ Active' : '○ EQ Bypassed'}
            </button>
            <button className="btn-icon" onClick={onClose} aria-label="Close Equalizer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Presets Chips */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary, #94a3b8)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Sound Signature Presets</span>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-faint, #64748b)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.keys(EQUALIZER_PRESETS).map(preset => {
              const isActive = activePreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isActive ? '1px solid var(--color-accent, #00e5ff)' : '1px solid var(--color-border, #1f293d)',
                    background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'var(--color-surface, #0b101b)',
                    color: isActive ? 'var(--color-accent, #00e5ff)' : 'var(--color-text, #f8fafc)'
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '12px',
          background: 'var(--color-surface, #0b101b)',
          borderRadius: '12px',
          padding: '24px 16px',
          border: '1px solid var(--color-border-subtle, #1a2234)',
          opacity: isEnabled ? 1 : 0.45,
          transition: 'opacity 0.2s ease'
        }}>
          {BAND_CONFIGS.map(cfg => {
            const gain = bands[cfg.key];
            return (
              <div key={cfg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: gain > 0 ? 'var(--color-accent, #00e5ff)' : gain < 0 ? '#f43f5e' : 'var(--color-text-secondary, #94a3b8)' }}>
                  {gain > 0 ? `+${gain}` : gain} dB
                </span>

                <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    disabled={!isEnabled}
                    value={gain}
                    onChange={(e) => handleSliderChange(cfg.key, Number(e.target.value))}
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                      width: '8px',
                      height: '130px',
                      accentColor: 'var(--color-accent, #00e5ff)',
                      cursor: isEnabled ? 'pointer' : 'default'
                    }}
                  />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
                    {cfg.label}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--color-text-faint, #64748b)' }}>
                    {cfg.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-faint, #64748b)' }}>
          <span>Range: -12 dB (Cut) to +12 dB (Boost)</span>
          <button
            className="btn-primary"
            onClick={onClose}
            style={{ padding: '8px 24px', fontSize: '13px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
