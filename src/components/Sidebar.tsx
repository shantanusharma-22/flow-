import React from 'react';
import {
  Home,
  Compass,
  Library,
  Search,
  Clock,
  Download,
  AudioLines,
  ListMusic,
  Settings
} from 'lucide-react';
import { Playlist, ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId, playlistId?: string) => void;
  playlists: Playlist[];
  onCreatePlaylistClick: () => void;
  activePlaylistId?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  playlists,
  onCreatePlaylistClick,
  activePlaylistId,
  searchQuery = '',
  onSearchChange
}) => {
  return (
    <aside
      className="sidebar"
      aria-label="Primary Navigation"
      style={{
        width: '220px',
        height: '100vh',
        backgroundColor: '#101217',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 14px',
        flexShrink: 0,
        zIndex: 40
      }}
    >
      {/* 1. macOS Window Traffic Light Dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingLeft: '4px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ed6a5e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f5bf4f' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#61c554' }} />
      </div>

      {/* 2. Search Input Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          padding: '6px 12px',
          marginBottom: '16px'
        }}
      >
        <Search size={15} style={{ color: '#8c92a4', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange?.(e.target.value);
            if (currentScreen !== 'search' && e.target.value.trim().length > 0) {
              onNavigate('search');
            }
          }}
          onFocus={() => {
            if (currentScreen !== 'search') onNavigate('search');
          }}
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

      {/* Scrollable Navigation Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Primary Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: currentScreen === 'home' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: currentScreen === 'home' ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== 'home') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== 'home') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Home size={17} />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Compass size={17} />
            <span>Explore</span>
          </button>

          <button
            onClick={() => onNavigate('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: currentScreen === 'library' && !activePlaylistId ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: currentScreen === 'library' && !activePlaylistId ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== 'library') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== 'library') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Library size={17} />
            <span>Library</span>
          </button>

          <button
            onClick={() => onNavigate('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: currentScreen === 'search' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: currentScreen === 'search' ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== 'search') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== 'search') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Search size={17} />
            <span>Search</span>
          </button>
        </div>

        {/* Secondary Nav Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button
            onClick={() => onNavigate('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Clock size={17} />
            <span>History</span>
          </button>

          <button
            onClick={() => onNavigate('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Download size={17} />
            <span>Downloads</span>
          </button>

          <button
            onClick={() => onNavigate('library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <AudioLines size={17} />
            <span>Local Music</span>
          </button>
        </div>

        {/* Playlists Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button
            onClick={() => onNavigate('playlist', 'playlist-liked')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: activePlaylistId === 'playlist-liked' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activePlaylistId === 'playlist-liked' ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activePlaylistId !== 'playlist-liked') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (activePlaylistId !== 'playlist-liked') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ListMusic size={17} />
            <span>Liked Music</span>
          </button>

          <button
            onClick={() => onNavigate('playlist', 'playlist-choti')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: activePlaylistId === 'playlist-choti' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activePlaylistId === 'playlist-choti' ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activePlaylistId !== 'playlist-choti') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (activePlaylistId !== 'playlist-choti') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ListMusic size={17} />
            <span>choti</span>
          </button>

          <button
            onClick={() => onNavigate('playlist', 'playlist-episodes-later')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: activePlaylistId === 'playlist-episodes-later' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activePlaylistId === 'playlist-episodes-later' ? '#ffffff' : '#8c92a4',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activePlaylistId !== 'playlist-episodes-later') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              if (activePlaylistId !== 'playlist-episodes-later') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ListMusic size={17} />
            <span>Episodes for Later</span>
          </button>

          {/* Any custom playlists created */}
          {playlists.filter(p => !['playlist-liked', 'playlist-choti', 'playlist-episodes-later'].includes(p.id)).map(p => (
            <button
              key={p.id}
              onClick={() => onNavigate('playlist', p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: activePlaylistId === p.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: activePlaylistId === p.id ? '#ffffff' : '#8c92a4',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <ListMusic size={17} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Bottom Settings */}
      <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
        <button
          onClick={() => onNavigate('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            width: '100%',
            borderRadius: '8px',
            backgroundColor: currentScreen === 'settings' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
            color: currentScreen === 'settings' ? '#ffffff' : '#cbd5e1',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          onMouseLeave={(e) => {
            if (currentScreen !== 'settings') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
          }}
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
