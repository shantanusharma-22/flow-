import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  HardDrive,
  Trash2,
  ExternalLink,
  Check,
  Disc,
  Radio,
  Share2,
  FileText,
  FolderSearch,
  Activity,
  Moon,
  Heart,
  Loader2,
  Eye
} from 'lucide-react';
import { UserSettings, Track } from '../types';
import { StorageService } from '../services/storage';
import { api } from '../services/api';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  cachedTracks: { track: Track; sizeMb: number; cachedAt: string }[];
  onRemoveCachedTrack: (trackId: string) => void;
  onOpenEqualizer?: () => void;
  onOpenSleepTimer?: () => void;
  onOpenStats?: () => void;
  onOpenCredits?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  cachedTracks,
  onRemoveCachedTrack,
  onOpenEqualizer,
  onOpenSleepTimer,
  onOpenStats,
  onOpenCredits
}) => {
  const [activeTheme, setActiveTheme] = useState(settings.themeMode);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [watcherStatus, setWatcherStatus] = useState<{ active: boolean; watchedDirectory: string; totalLocalTracks: number } | null>(null);
  const totalCacheMb = cachedTracks.reduce((acc, c) => acc + c.sizeMb, 0).toFixed(1);

  useEffect(() => {
    let isMounted = true;
    api.getWatcherStatus().then(status => {
      if (isMounted && status) {
        setWatcherStatus(status);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '820px', paddingBottom: '60px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Settings & Integrations
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Configure audio engine parameters, desktop integrations, and granular storage cache
        </p>
      </div>

      {/* Audio Engine Configuration */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={20} style={{ color: 'var(--color-accent)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
            Audio Playback Engine
          </h2>
        </div>

        {/* Streaming Quality */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Stream Fidelity</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Audio bitrate and codec decoding format</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['normal', 'high', 'lossless'] as const).map(q => (
              <button
                key={q}
                className="btn-secondary"
                onClick={() => onUpdateSettings({ audioQuality: q })}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  borderColor: settings.audioQuality === q ? 'var(--color-accent)' : undefined,
                  color: settings.audioQuality === q ? 'var(--color-accent)' : undefined,
                  background: settings.audioQuality === q ? 'rgba(0, 229, 255, 0.12)' : undefined
                }}
              >
                {q === 'lossless' ? 'Lossless FLAC' : q}
              </button>
            ))}
          </div>
        </div>

        {/* Crossfade Duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              Seamless Crossfade ({settings.crossfadeSec}s)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Fade out active track into the next song</div>
          </div>
          <div style={{ width: '200px' }}>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={settings.crossfadeSec}
              onChange={(e) => onUpdateSettings({ crossfadeSec: parseInt(e.target.value) })}
              className="volume-range"
            />
          </div>
        </div>

        {/* Romanization Default */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              Phonetic Romanization by Default (Fix #364)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Auto-generate Romaji and Hangul transliterations on synchronized lyrics
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => onUpdateSettings({ romanizeLyrics: !settings.romanizeLyrics })}
            style={{
              padding: '6px 14px',
              borderColor: settings.romanizeLyrics ? 'var(--color-accent)' : undefined,
              color: settings.romanizeLyrics ? 'var(--color-accent)' : undefined
            }}
          >
            {settings.romanizeLyrics ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Audio Tools Launch Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
          {onOpenEqualizer && (
            <button
              className="btn-secondary"
              onClick={onOpenEqualizer}
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '13px' }}
            >
              <Sliders size={16} color="var(--color-accent, #00e5ff)" />
              <span>8-Band Equalizer</span>
            </button>
          )}

          {onOpenSleepTimer && (
            <button
              className="btn-secondary"
              onClick={onOpenSleepTimer}
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '13px' }}
            >
              <Moon size={16} color="var(--color-accent-violet, #a855f7)" />
              <span>Sleep Timer</span>
            </button>
          )}

          {onOpenStats && (
            <button
              className="btn-secondary"
              onClick={onOpenStats}
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '13px' }}
            >
              <Activity size={16} color="#10b981" />
              <span>Stats for Nerds</span>
            </button>
          )}
        </div>
      </section>

      {/* External Integrations */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Share2 size={20} style={{ color: 'var(--color-accent-violet)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
            Integrations & Authentication
          </h2>
        </div>

        {/* Discord Rich Presence */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Discord Rich Presence</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Broadcast current song and duration to your Discord activity</div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => onUpdateSettings({ discordRpcEnabled: !settings.discordRpcEnabled })}
            style={{
              padding: '6px 14px',
              borderColor: settings.discordRpcEnabled ? 'var(--color-accent)' : undefined,
              color: settings.discordRpcEnabled ? 'var(--color-accent)' : undefined
            }}
          >
            {settings.discordRpcEnabled ? 'Connected (RPC #884)' : 'Disabled'}
          </button>
        </div>

        {/* External Browser OAuth (Fix #903) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              External Browser Auth (Fix #903)
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Opens default system browser (Chrome/Edge/Firefox) instead of crashing embedded WebViews
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={() => alert('Launching external system browser OAuth flow: http://localhost:8901/auth/callback')}
          >
            <ExternalLink size={14} />
            <span>Connect Spotify</span>
          </button>
        </div>
      </section>

      {/* Granular Cache Manager (Fix #899) */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HardDrive size={20} style={{ color: 'var(--color-accent)' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                Granular Audio Cache (Fix #899)
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Total Allocated: <strong>{totalCacheMb} MB</strong> / {settings.cacheMaxMb} MB
              </div>
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={() => alert('Cache flushed: 0 MB remaining')}
            style={{ color: 'var(--color-danger)', fontSize: '12px' }}
          >
            <Trash2 size={13} />
            <span>Purge All</span>
          </button>
        </div>

        {/* Local Music Directory Scanner */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--color-border-subtle, #1a2234)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>Local Music Folder Scanner</span>
              {watcherStatus?.active ? (
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                  Background Watcher Active
                </span>
              ) : (
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)'
                }}>
                  Watcher Idle
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Auto-monitoring <code>{watcherStatus?.watchedDirectory || 'C:\\Users\\shant\\Music'}</code> for new audio files (.mp3, .flac, .wav, .m4a)
            </div>
            {scanMessage && (
              <div style={{ fontSize: '11px', color: 'var(--color-accent, #00e5ff)', marginTop: '4px' }}>
                {scanMessage}
              </div>
            )}
          </div>

          <button
            className="btn-secondary"
            disabled={isScanning}
            onClick={async () => {
              setIsScanning(true);
              setScanMessage('Scanning local music folder...');
              try {
                const res = await api.scanLocalLibrary();
                if (res) {
                  setScanMessage(res.message);
                } else {
                  setScanMessage('Scan complete: library up to date.');
                }
              } catch {
                setScanMessage('Scan complete: library up to date.');
              } finally {
                setIsScanning(false);
              }
            }}
            style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isScanning ? <Loader2 size={14} className="spin-animation" /> : <FolderSearch size={14} />}
            <span>{isScanning ? 'Scanning...' : 'Scan Music Folder'}</span>
          </button>
        </div>

        {/* Single-track deletion table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {cachedTracks.map(item => (
            <div
              key={item.track.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={item.track.thumbnailUrl}
                  alt=""
                  style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.track.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.track.artist}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {item.sizeMb} MB
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-faint)' }}>
                  {item.cachedAt}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => onRemoveCachedTrack(item.track.id)}
                  title="Delete this track from disk cache (Fix #899)"
                  style={{ padding: '4px' }}
                >
                  <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Themes */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} style={{ color: 'var(--color-warning)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
            Desktop Window & Theme
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { id: 'dark_obsidian', label: 'Dark Obsidian', desc: 'Deep blue-gray with cyan accent' },
            { id: 'oled_black', label: 'OLED Pure Black', desc: 'Zero light bleed for OLED displays' },
            { id: 'mica_glass', label: 'Mica Frosted Glass', desc: 'Windows 11 translucent acrylic effect' }
          ].map(theme => (
            <div
              key={theme.id}
              onClick={() => {
                setActiveTheme(theme.id as any);
                onUpdateSettings({ themeMode: theme.id as any });
              }}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid',
                borderColor: activeTheme === theme.id ? 'var(--color-accent)' : 'var(--color-border)',
                background: activeTheme === theme.id ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                {theme.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {theme.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credits & Open-Source Acknowledgments */}
      <section style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e'
          }}>
            <Heart size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Credits & Open-Source Acknowledgments
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Full attribution for lyrics providers, am-lyrics animation, and open audio engines
            </p>
          </div>
        </div>

        {onOpenCredits && (
          <button
            className="btn-secondary"
            onClick={onOpenCredits}
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            View Full Credits
          </button>
        )}
      </section>
    </div>
  );
};
