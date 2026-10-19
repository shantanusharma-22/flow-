import React from 'react';
import { Search, X, Radio, Maximize2, Minimize2, Sparkles, User } from 'lucide-react';
import { ScreenId } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (screen: ScreenId) => void;
  currentScreen: ScreenId;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onNavigate,
  currentScreen,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <header className="top-header">
      <div className="search-input-wrapper">
        <Search size={16} className="search-input-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search songs, artists, albums, or lyrics..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (currentScreen !== 'search' && e.target.value.trim().length > 0) {
              onNavigate('search');
            }
          }}
          onFocus={() => {
            if (currentScreen !== 'search') {
              onNavigate('search');
            }
          }}
        />
        {searchQuery && (
          <button
            className="btn-icon"
            onClick={() => onSearchChange('')}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Radio size={11} />
            <span>YOUTUBE MUSIC</span>
          </span>

          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(52, 211, 153, 0.12)',
            color: 'var(--color-success)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={11} />
            <span>HI-RES FLAC</span>
          </span>

          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            title="Listen Together Room Session"
            onClick={() => alert('Listen Together: Sync Room active (WebRTC mesh ready). Share code: FLOW-8891')}
          >
            <Radio size={14} style={{ color: 'var(--color-accent)' }} />
            <span>Listen Together</span>
          </button>
        </div>

        <button
          className="btn-icon"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F11)'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>

        <button
          className="btn-icon"
          onClick={() => onNavigate('settings')}
          title="Account & Settings"
          style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%' }}
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
};
