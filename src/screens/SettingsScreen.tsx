import React, { useState } from 'react';
import {
  Search,
  Share2,
  ChevronRight,
  AudioLines,
  PlayCircle,
  Plus,
  Sliders,
  Moon,
  Activity,
  HardDrive
} from 'lucide-react';
import { UserSettings, Track } from '../types';

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
  const [searchFilter, setSearchFilter] = useState('');
  const [jiosaavnEnabled, setJiosaavnEnabled] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'high' | 'lossless'>(
    (settings.audioQuality as any) || 'lossless'
  );

  const handleQualitySelect = (quality: 'low' | 'medium' | 'high' | 'lossless') => {
    setSelectedQuality(quality);
    onUpdateSettings({ audioQuality: quality as any });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        padding: '24px 36px 60px 36px',
        maxWidth: '860px',
        color: '#ffffff'
      }}
    >
      {/* Top Header with Search settings pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Settings
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '7px 16px',
            width: '240px'
          }}
        >
          <Search size={15} style={{ color: '#8c92a4' }} />
          <input
            type="text"
            placeholder="Search settings"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* 1. ACCOUNT Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#717684',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          ACCOUNT
        </span>

        <div
          onClick={() => {
            alert('Account & Integrations: Discord Rich Presence, Last.fm scrobbling, and ListenBrainz are active.');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Share2 size={18} style={{ color: '#ffffff' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Account & integrations</div>
            <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '2px' }}>
              Discord rich presence, Last.fm and ListenBrainz
            </div>
          </div>

          <ChevronRight size={18} style={{ color: '#717684' }} />
        </div>
      </section>

      {/* 2. LISTEN TOGETHER Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#717684',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          LISTEN TOGETHER
        </span>

        <div
          onClick={() => {
            alert('Listen Together Room Session: Share code FLOW-8891 with friends to synchronize audio stream.');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Listen together</div>
            <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '2px' }}>
              Get a code to share with friends
            </div>
          </div>

          <ChevronRight size={18} style={{ color: '#717684' }} />
        </div>
      </section>

      {/* 3. SOURCES, TRIED IN THIS ORDER Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#717684',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          SOURCES, TRIED IN THIS ORDER
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Row 1: JioSaavn */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#717684', width: '22px' }}>1</span>
            <div style={{ marginRight: '14px', color: '#ffffff', display: 'flex', alignItems: 'center' }}>
              <AudioLines size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>JioSaavn</div>
              <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '2px' }}>High Quality · 320kbps</div>
            </div>

            {/* Toggle Switch */}
            <div
              onClick={() => setJiosaavnEnabled(!jiosaavnEnabled)}
              style={{
                width: '46px',
                height: '26px',
                borderRadius: '9999px',
                backgroundColor: jiosaavnEnabled ? '#ffffff' : '#334155',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: jiosaavnEnabled ? '#000000' : '#ffffff',
                  transform: jiosaavnEnabled ? 'translateX(20px)' : 'translateX(0px)',
                  transition: 'transform 0.2s ease, background-color 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Row 2: YouTube Music */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#717684', width: '22px' }}>2</span>
            <div style={{ marginRight: '14px', color: '#ffffff', display: 'flex', alignItems: 'center' }}>
              <PlayCircle size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>YouTube Music</div>
              <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '2px' }}>
                Lossy · Full catalogue · Radio
              </div>
            </div>

            <span style={{ fontSize: '12.5px', color: '#8c92a4', fontWeight: 500 }}>Always on</span>
          </div>

          {/* Row 3: Add a source */}
          <div
            onClick={() => {
              const url = prompt('Add custom audio source URL (e.g. Navidrome / Subsonic / HTTP Addon):');
              if (url) alert(`Added source: ${url}`);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '14px',
                flexShrink: 0
              }}
            >
              <Plus size={18} style={{ color: '#ffffff' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Add a source</div>
              <div style={{ fontSize: '12px', color: '#8c92a4', marginTop: '2px', lineHeight: 1.4 }}>
                An addon server you host or were given a link to. Searched and streamed over plain HTTP — no code is
                downloaded or run.
              </div>
            </div>

            <ChevronRight size={18} style={{ color: '#717684', flexShrink: 0, marginLeft: '12px' }} />
          </div>
        </div>
      </section>

      {/* 4. AUDIO QUALITY Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#717684',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          AUDIO QUALITY
        </span>

        {/* Segmented Button Group */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '9999px',
            padding: '4px',
            alignSelf: 'flex-start'
          }}
        >
          {(['low', 'medium', 'high', 'lossless'] as const).map((q) => {
            const isSelected = selectedQuality === q;
            return (
              <button
                key={q}
                onClick={() => handleQualitySelect(q)}
                style={{
                  padding: '7px 22px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#000000' : '#8c92a4',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {q}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '12px', color: '#8c92a4' }}>
          Your addons + JioSaavn. bit-exact where available
        </div>
      </section>

      {/* 5. Additional Tools & Diagnostics */}
      <section style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {onOpenEqualizer && (
          <button
            onClick={onOpenEqualizer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Sliders size={14} />
            <span>Equalizer</span>
          </button>
        )}

        {onOpenSleepTimer && (
          <button
            onClick={onOpenSleepTimer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Moon size={14} />
            <span>Sleep Timer</span>
          </button>
        )}

        {onOpenStats && (
          <button
            onClick={onOpenStats}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Activity size={14} />
            <span>Stats For Nerds</span>
          </button>
        )}

        {onOpenCredits && (
          <button
            onClick={onOpenCredits}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <span>Credits & Licenses</span>
          </button>
        )}
      </section>
    </div>
  );
};
