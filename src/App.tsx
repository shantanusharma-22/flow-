import React, { useState, useEffect, useCallback } from 'react';
import { ScreenId, Track, Playlist, Artist, RepeatMode, UserSettings } from './types';
import { SEED_TRACKS, SEED_PLAYLISTS, SEED_ARTISTS } from './data/seed';
import { audioPlayer } from './services/audioPlayer';
import { StorageService } from './services/storage';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerBar } from './components/PlayerBar';
import { SyncedLyrics } from './components/SyncedLyrics';
import { QueueDrawer } from './components/QueueDrawer';
import { ContextMenu } from './components/ContextMenu';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';

import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { NowPlayingScreen } from './screens/NowPlayingScreen';
import { PlaylistScreen } from './screens/PlaylistScreen';
import { ArtistScreen } from './screens/ArtistScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export const App: React.FC = () => {
  // Navigation & Screens
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | undefined>(undefined);
  const [activeArtistId, setActiveArtistId] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search & Library Data
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(StorageService.getRecentSearches());
  const [playlists, setPlaylists] = useState<Playlist[]>(StorageService.getPlaylists());
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(StorageService.getLikedTrackIds());
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<Set<string>>(StorageService.getDownloadedTrackIds());
  const [cachedTracks, setCachedTracks] = useState(StorageService.getCachedTracks());
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());

  // Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SEED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(SEED_TRACKS[0].durationSec);
  const [volume, setVolume] = useState(0.8);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState<Track[]>(SEED_TRACKS.slice(1));
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  // Overlays & Drawers
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; track: Track } | null>(null);

  // Wire Audio Engine Callbacks
  useEffect(() => {
    audioPlayer.registerEvents({
      onTimeUpdate: (current, duration) => {
        setCurrentTimeSec(current);
        if (duration > 0) setDurationSec(duration);
      },
      onStateChange: (playing) => {
        setIsPlaying(playing);
      },
      onEnded: () => {
        handleNextTrack();
      },
      onError: (err) => {
        console.warn('Playback notice:', err);
      }
    });
  }, [queue, repeatMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          audioPlayer.seek(Math.max(0, currentTimeSec - 5));
          break;
        case 'ArrowRight':
          e.preventDefault();
          audioPlayer.seek(Math.min(durationSec, currentTimeSec + 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.05));
          break;
        case 'Escape':
          setContextMenu(null);
          setIsCreatePlaylistOpen(false);
          if (currentScreen === 'nowPlaying') setCurrentScreen('home');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimeSec, durationSec, volume, isPlaying, currentScreen]);

  // Player Control Handlers
  const handlePlayTrack = useCallback(async (track: Track) => {
    setCurrentTrack(track);
    setDurationSec(track.durationSec);
    setCurrentTimeSec(0);
    await audioPlayer.playTrack(track);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!currentTrack) {
      if (SEED_TRACKS.length > 0) handlePlayTrack(SEED_TRACKS[0]);
      return;
    }
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.resume();
    }
  }, [currentTrack, isPlaying, handlePlayTrack]);

  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue(queue.slice(1));
      handlePlayTrack(next);
    } else if (autoplayEnabled && SEED_TRACKS.length > 0) {
      // Autoplay random similar track
      const randomTrack = SEED_TRACKS[Math.floor(Math.random() * SEED_TRACKS.length)];
      handlePlayTrack(randomTrack);
    } else {
      audioPlayer.pause();
    }
  }, [queue, autoplayEnabled, handlePlayTrack]);

  const handlePrevTrack = useCallback(() => {
    if (currentTimeSec > 4) {
      audioPlayer.seek(0);
    } else {
      // Play previous seed track
      const currentIndex = SEED_TRACKS.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex > 0) {
        handlePlayTrack(SEED_TRACKS[currentIndex - 1]);
      } else {
        audioPlayer.seek(0);
      }
    }
  }, [currentTimeSec, currentTrack, handlePlayTrack]);

  const handleSeek = (seconds: number) => {
    setCurrentTimeSec(seconds);
    audioPlayer.seek(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioPlayer.setVolume(vol);
  };

  const handleToggleMute = () => {
    const isMuted = audioPlayer.toggleMute();
    setVolume(isMuted ? 0 : audioPlayer.getVolume());
  };

  const handleCycleRepeat = () => {
    const nextMode: RepeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    setRepeatMode(nextMode);
    audioPlayer.setRepeatMode(nextMode);
  };

  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      // Shuffle upcoming queue
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    audioPlayer.setSpeed(speed);
  };

  // Likes & Downloads Handlers
  const handleToggleLike = (trackId: string) => {
    StorageService.toggleLikedTrack(trackId);
    setLikedTrackIds(StorageService.getLikedTrackIds());
  };

  const handleToggleDownload = (trackId: string) => {
    StorageService.toggleDownloadedTrack(trackId);
    setDownloadedTrackIds(StorageService.getDownloadedTrackIds());
  };

  // Queue Operations
  const handleAddToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const handlePlayNext = (track: Track) => {
    setQueue(prev => [track, ...prev]);
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveQueueItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= queue.length) return;
    const copy = [...queue];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    setQueue(copy);
  };

  // Navigation Handlers
  const handleNavigate = (screen: ScreenId, playlistId?: string, artistId?: string) => {
    setCurrentScreen(screen);
    setActivePlaylistId(playlistId);
    setActiveArtistId(artistId);
    setIsLyricsOpen(false);
  };

  // Playlist Actions
  const handlePlayPlaylist = (pl: Playlist) => {
    if (pl.tracks.length > 0) {
      handlePlayTrack(pl.tracks[0]);
      setQueue(pl.tracks.slice(1));
    }
  };

  const handleShufflePlaylist = (pl: Playlist) => {
    if (pl.tracks.length > 0) {
      const shuffled = [...pl.tracks].sort(() => Math.random() - 0.5);
      handlePlayTrack(shuffled[0]);
      setQueue(shuffled.slice(1));
    }
  };

  const handleCreatePlaylist = (title: string, description: string) => {
    const created = StorageService.createPlaylist(title, description);
    setPlaylists(StorageService.getPlaylists());
    handleNavigate('playlist', created.id);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    StorageService.deletePlaylist(playlistId);
    setPlaylists(StorageService.getPlaylists());
    handleNavigate('library');
  };

  const handleAddTrackToPlaylist = (playlistId: string, track: Track) => {
    StorageService.addTrackToPlaylist(playlistId, track);
    setPlaylists(StorageService.getPlaylists());
  };

  // Cached Track Eviction (Fix #899)
  const handleRemoveCachedTrack = (trackId: string) => {
    setCachedTracks(prev => prev.filter(c => c.track.id !== trackId));
  };

  // Context Menu
  const handleOpenContextMenu = (e: React.MouseEvent, track: Track) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, track });
  };

  // Fullscreen Windowing (Fix #884/#913)
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Active Playlist / Liked Songs object
  const currentPlaylist = activePlaylistId === 'liked-songs'
    ? {
        id: 'liked-songs',
        title: 'Liked Songs',
        description: 'All your favorite songs gathered in one place.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        isCustom: false,
        createdAt: '2026-10-19',
        source: 'local' as const,
        tracks: SEED_TRACKS.filter(t => likedTrackIds.has(t.id))
      }
    : playlists.find(p => p.id === activePlaylistId);

  const currentArtist = SEED_ARTISTS.find(a => a.id === activeArtistId);

  const likedTracks = SEED_TRACKS.filter(t => likedTrackIds.has(t.id));
  const downloadedTracks = SEED_TRACKS.filter(t => downloadedTrackIds.has(t.id));

  return (
    <div className="app-container">
      {/* Dynamic Ambient Background Canvas Mesh */}
      <div
        className="ambient-glow-backdrop"
        style={{ backgroundColor: currentTrack?.accentColor || '#00e5ff' }}
      />
      <div
        className="ambient-glow-secondary"
        style={{ backgroundColor: currentTrack?.accentColor ? '#a855f7' : '#38bdf8' }}
      />

      {/* Left Sidebar Shell */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        playlists={playlists}
        onCreatePlaylistClick={() => setIsCreatePlaylistOpen(true)}
        activePlaylistId={activePlaylistId}
      />

      {/* Main Content Stage */}
      <main className="main-stage">
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim()) StorageService.addRecentSearch(q);
          }}
          onNavigate={handleNavigate}
          currentScreen={currentScreen}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        <div className="screen-viewport">
          {/* S01: Home Screen */}
          {currentScreen === 'home' && (
            <HomeScreen
              tracks={SEED_TRACKS}
              playlists={playlists}
              artists={SEED_ARTISTS}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onPlayTrack={handlePlayTrack}
              onPlayPlaylist={handlePlayPlaylist}
              onToggleLike={handleToggleLike}
              onContextMenu={handleOpenContextMenu}
              onPlaylistClick={(id) => handleNavigate('playlist', id)}
              onArtistClick={(id) => handleNavigate('artist', undefined, id)}
            />
          )}

          {/* S02: Search Screen */}
          {currentScreen === 'search' && (
            <SearchScreen
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              recentSearches={recentSearches}
              onClearRecentSearches={() => {
                StorageService.clearRecentSearches();
                setRecentSearches([]);
              }}
              tracks={SEED_TRACKS}
              playlists={playlists}
              artists={SEED_ARTISTS}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              onContextMenu={handleOpenContextMenu}
              onPlaylistClick={(id) => handleNavigate('playlist', id)}
              onArtistClick={(id) => handleNavigate('artist', undefined, id)}
            />
          )}

          {/* S06: Playlist & Album Detail */}
          {currentScreen === 'playlist' && currentPlaylist && (
            <PlaylistScreen
              playlist={currentPlaylist}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onPlayTrack={handlePlayTrack}
              onPlayAll={handlePlayPlaylist}
              onShuffleAll={handleShufflePlaylist}
              onToggleLike={handleToggleLike}
              onContextMenu={handleOpenContextMenu}
              onDeletePlaylist={handleDeletePlaylist}
              onBack={() => handleNavigate('home')}
              onArtistClick={(id) => handleNavigate('artist', undefined, id)}
            />
          )}

          {/* S07: Artist Screen */}
          {currentScreen === 'artist' && currentArtist && (
            <ArtistScreen
              artist={currentArtist}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              onContextMenu={handleOpenContextMenu}
              onBack={() => handleNavigate('home')}
            />
          )}

          {/* S08: Library & Downloads */}
          {currentScreen === 'library' && (
            <LibraryScreen
              playlists={playlists}
              likedTracks={likedTracks}
              downloadedTracks={downloadedTracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              onPlayTrack={handlePlayTrack}
              onPlayPlaylist={handlePlayPlaylist}
              onToggleLike={handleToggleLike}
              onContextMenu={handleOpenContextMenu}
              onPlaylistClick={(id) => handleNavigate('playlist', id)}
              onCreatePlaylistClick={() => setIsCreatePlaylistOpen(true)}
            />
          )}

          {/* S09: Settings Screen */}
          {currentScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={(part) => setSettings(StorageService.updateSettings(part))}
              cachedTracks={cachedTracks}
              onRemoveCachedTrack={handleRemoveCachedTrack}
            />
          )}
        </div>
      </main>

      {/* S04: Synchronized Lyrics Drawer / Overlay */}
      {isLyricsOpen && currentTrack && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 'var(--player-dock-height)',
          width: '460px',
          background: 'rgba(11, 16, 27, 0.94)',
          backdropFilter: 'blur(30px)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 60,
          boxShadow: 'var(--shadow-popover)'
        }}>
          <SyncedLyrics
            track={currentTrack}
            currentTimeSec={currentTimeSec}
            onSeek={handleSeek}
            onClose={() => setIsLyricsOpen(false)}
            initialRomanize={settings.romanizeLyrics}
          />
        </div>
      )}

      {/* S05: Up Next Queue Drawer */}
      {isQueueOpen && (
        <QueueDrawer
          currentTrack={currentTrack}
          queue={queue}
          onClose={() => setIsQueueOpen(false)}
          onPlayTrack={handlePlayTrack}
          onRemoveFromQueue={handleRemoveFromQueue}
          onClearQueue={() => setQueue([])}
          onMoveQueueItem={handleMoveQueueItem}
          autoplayEnabled={autoplayEnabled}
          onToggleAutoplay={() => setAutoplayEnabled(!autoplayEnabled)}
        />
      )}

      {/* S03: Expanded Now Playing Fullscreen Modal */}
      {currentScreen === 'nowPlaying' && currentTrack && (
        <NowPlayingScreen
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTimeSec={currentTimeSec}
          durationSec={durationSec}
          volume={volume}
          repeatMode={repeatMode}
          isShuffle={isShuffle}
          isLiked={likedTrackIds.has(currentTrack.id)}
          isDownloaded={downloadedTrackIds.has(currentTrack.id)}
          queue={queue}
          onPlayPause={handlePlayPause}
          onPrev={handlePrevTrack}
          onNext={handleNextTrack}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onCycleRepeat={handleCycleRepeat}
          onToggleShuffle={handleToggleShuffle}
          onToggleLike={() => handleToggleLike(currentTrack.id)}
          onToggleDownload={() => handleToggleDownload(currentTrack.id)}
          onClose={() => setCurrentScreen('home')}
          onPlayTrack={handlePlayTrack}
          onRemoveFromQueue={handleRemoveFromQueue}
          onClearQueue={() => setQueue([])}
          onMoveQueueItem={handleMoveQueueItem}
        />
      )}

      {/* Persistent Bottom PlayerBar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTimeSec={currentTimeSec}
        durationSec={durationSec}
        volume={volume}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        playbackSpeed={playbackSpeed}
        isLyricsOpen={isLyricsOpen}
        isQueueOpen={isQueueOpen}
        isLiked={currentTrack ? likedTrackIds.has(currentTrack.id) : false}
        isDownloaded={currentTrack ? downloadedTrackIds.has(currentTrack.id) : false}
        onPlayPause={handlePlayPause}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onCycleRepeat={handleCycleRepeat}
        onToggleShuffle={handleToggleShuffle}
        onChangeSpeed={handleChangeSpeed}
        onToggleLyrics={() => setIsLyricsOpen(!isLyricsOpen)}
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        onToggleLike={() => currentTrack && handleToggleLike(currentTrack.id)}
        onToggleDownload={() => currentTrack && handleToggleDownload(currentTrack.id)}
        onOpenNowPlaying={() => setCurrentScreen('nowPlaying')}
      />

      {/* Context Menu Popover */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          track={contextMenu.track}
          playlists={playlists}
          isLiked={likedTrackIds.has(contextMenu.track.id)}
          isDownloaded={downloadedTrackIds.has(contextMenu.track.id)}
          onClose={() => setContextMenu(null)}
          onPlayNow={handlePlayTrack}
          onPlayNext={handlePlayNext}
          onAddToQueue={handleAddToQueue}
          onAddToPlaylist={handleAddTrackToPlaylist}
          onToggleLike={handleToggleLike}
          onToggleDownload={handleToggleDownload}
          onExportLrc={(t) => StorageService.exportLrcFile(t)}
          onGoToArtist={(artId) => handleNavigate('artist', undefined, artId)}
        />
      )}

      {/* Modal: Create Local Playlist (Fix #904) */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};
