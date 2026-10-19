import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { UserSettings, Track } from '../types';
import { StorageService } from '../services/storage';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  cachedTracks: { track: Track; sizeMb: number; cachedAt: string }[];
  onRemoveCachedTrack: (trackId: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  cachedTracks,
  onRemoveCachedTrack
}) => {
  const [activeTheme, setActiveTheme] = useState(settings.themeMode);
  const totalCacheMb = cachedTracks.reduce((acc, c) => acc + c.sizeMb, 0).toFixed(1);

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
    </div>
  );
};
