import React from 'react';
import { Home, Search, Library, Settings, Plus, Heart, Music, Disc, Sparkles } from 'lucide-react';
import { Playlist, ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, playlistId?: string) => void;
  playlists: Playlist[];
  onCreatePlaylistClick: () => void;
  activePlaylistId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  playlists,
  onCreatePlaylistClick,
  activePlaylistId
}) => {
  return (
    <aside className="sidebar" aria-label="Primary Navigation">
      <div className="sidebar-header">
        <img
          src="/replica/assets/flow_logo.png"
          alt="Flow Logo"
          className="brand-logo-img"
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="brand-title">FLOW</span>
            <span className="brand-badge">PRO</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-text-faint)', letterSpacing: '0.04em' }}>
            DESKTOP STREAMING
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
          aria-label="Navigate to Home"
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${currentScreen === 'search' ? 'active' : ''}`}
          onClick={() => onNavigate('search')}
          aria-label="Navigate to Search"
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          className={`nav-item ${currentScreen === 'library' && !activePlaylistId ? 'active' : ''}`}
          onClick={() => onNavigate('library')}
          aria-label="Navigate to Library"
        >
          <Library size={18} />
          <span>Your Library</span>
        </button>

        <button
          className={`nav-item ${currentScreen === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
          aria-label="Navigate to Settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          className={`nav-item ${currentScreen === 'landing' ? 'active' : ''}`}
          onClick={() => onNavigate('landing')}
          aria-label="Navigate to Launch Showcase"
        >
          <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
          <span>Launch Showcase</span>
        </button>
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">
        <span>Playlists</span>
        <button
          className="btn-icon"
          onClick={onCreatePlaylistClick}
          aria-label="Create local playlist"
          title="Create local playlist (Zero-login)"
          style={{ padding: '4px' }}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="sidebar-playlists-scroll">
        <button
          className={`nav-item ${activePlaylistId === 'liked-songs' ? 'active' : ''}`}
          onClick={() => onNavigate('playlist', 'liked-songs')}
        >
          <Heart size={16} style={{ color: 'var(--color-danger)' }} />
          <span>Liked Songs</span>
        </button>

        {playlists.map(pl => (
          <button
            key={pl.id}
            className={`nav-item ${activePlaylistId === pl.id ? 'active' : ''}`}
            onClick={() => onNavigate('playlist', pl.id)}
            style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            {pl.isCustom ? <Music size={15} style={{ opacity: 0.7 }} /> : <Disc size={15} style={{ opacity: 0.7 }} />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
