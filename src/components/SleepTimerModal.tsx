import React, { useState, useEffect } from 'react';
import { Moon, Clock, X, Check, Volume2 } from 'lucide-react';
import { audioPlayer } from '../services/audioPlayer';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESETS: { value: number | 'end_of_track'; label: string; desc: string }[] = [
  { value: 15, label: '15 Minutes', desc: 'Short power nap' },
  { value: 30, label: '30 Minutes', desc: 'Bedtime relaxation' },
  { value: 45, label: '45 Minutes', desc: 'Deep sleep transition' },
  { value: 60, label: '1 Hour', desc: 'Extended nocturnal flow' },
  { value: 'end_of_track', label: 'End of Track', desc: 'Stop when current song finishes' }
];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const [remainingSec, setRemainingSec] = useState<number | null>(audioPlayer.getSleepTimerRemainingSec());
  const [activeOption, setActiveOption] = useState<number | 'end_of_track' | null>(audioPlayer.getSleepTimerOption());
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setRemainingSec(audioPlayer.getSleepTimerRemainingSec());
    setActiveOption(audioPlayer.getSleepTimerOption());

    const interval = setInterval(() => {
      const sec = audioPlayer.getSleepTimerRemainingSec();
      setRemainingSec(sec);
      setActiveOption(audioPlayer.getSleepTimerOption());
      setIsFading(sec !== null && sec <= 30 && sec > 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (value: number | 'end_of_track') => {
    audioPlayer.setSleepTimer(value);
    setActiveOption(value);
    setRemainingSec(audioPlayer.getSleepTimerRemainingSec());
  };

  const handleCancelTimer = () => {
    audioPlayer.cancelSleepTimer();
    setActiveOption(null);
    setRemainingSec(null);
    setIsFading(false);
  };

  const formatCountdown = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
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
        width: '460px',
        maxWidth: '92vw',
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
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-violet, #a855f7)'
            }}>
              <Moon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text, #f8fafc)', margin: 0 }}>
                Sleep Timer & Fadeout
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)', margin: '2px 0 0' }}>
                Automatically stops music with a gradual 30s volume fadeout
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Close Sleep Timer">
            <X size={18} />
          </button>
        </div>

        {/* Live Timer Status Banner */}
        {activeOption !== null && (
          <div style={{
            background: isFading ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 229, 255, 0.12)',
            border: `1px solid ${isFading ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 229, 255, 0.3)'}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color={isFading ? '#f43f5e' : 'var(--color-accent, #00e5ff)'} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text, #f8fafc)' }}>
                  {activeOption === 'end_of_track' ? 'Stopping at End of Track' : 'Timer Active'}
                </div>
                <div style={{ fontSize: '11px', color: isFading ? '#f43f5e' : 'var(--color-text-secondary, #94a3b8)' }}>
                  {isFading ? '30-second smooth volume fadeout in progress...' : remainingSec !== null ? `${formatCountdown(remainingSec)} remaining` : 'Waiting for track end'}
                </div>
              </div>
            </div>

            <button
              onClick={handleCancelTimer}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Presets List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRESETS.map(p => {
            const isSelected = activeOption === p.value;
            return (
              <button
                key={String(p.value)}
                onClick={() => handleSelectPreset(p.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--color-surface, #0b101b)',
                  border: isSelected ? '1px solid var(--color-accent-violet, #a855f7)' : '1px solid var(--color-border-subtle, #1a2234)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'var(--color-accent-violet, #a855f7)' : 'var(--color-text, #f8fafc)' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-faint, #64748b)' }}>
                    {p.desc}
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-violet, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#080b12'
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Fadeout Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-text-faint, #64748b)', borderTop: '1px solid var(--color-border-subtle, #1a2234)', paddingTop: '14px' }}>
          <Volume2 size={13} />
          <span>Linear acoustic fadeout begins automatically 30 seconds before shutoff.</span>
        </div>
      </div>
    </div>
  );
};
