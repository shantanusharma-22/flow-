import React from 'react';
import { LayoutGrid, MoreVertical, Play } from 'lucide-react';
import { Track, Playlist, Artist } from '../types';
import { SEED_ALBUMS } from '../data/seed';

interface HomeScreenProps {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayTrack: (track: Track) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onToggleLike: (trackId: string) => void;
  onContextMenu: (e: React.MouseEvent, track: Track) => void;
  onPlaylistClick: (playlistId: string) => void;
  onArtistClick: (artistId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tracks,
  playlists,
  artists,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onPlayPlaylist,
  onToggleLike,
  onContextMenu,
  onPlaylistClick,
  onArtistClick
}) => {
  // Use first 12 tracks for recents
  const recentsTracks = tracks.slice(0, 12);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        padding: '24px 32px 60px 32px',
        color: '#ffffff'
      }}
    >
      {/* 1. Recents Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Recents
          </h1>
          <button
            title="Grid view"
            style={{
              background: 'none',
              border: 'none',
              color: '#8c92a4',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LayoutGrid size={20} />
          </button>
        </div>

        {/* 3-Column Grid of Recent Tracks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '8px 16px'
          }}
        >
          {recentsTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: currentTrack?.id === track.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentTrack?.id !== track.id) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (currentTrack?.id !== track.id) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Square Album Thumbnail */}
                <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                  <img
                    src={track.thumbnailUrl}
                    alt={track.title}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      objectFit: 'cover'
                    }}
                  />
                  {isThisPlaying && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Play size={16} fill="#ffffff" color="#ffffff" />
                    </div>
                  )}
                </div>

                {/* Title & Artist */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: currentTrack?.id === track.id ? 'var(--color-accent, #00e5ff)' : '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3
                    }}
                  >
                    {track.title}
                  </span>
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: '#8c92a4',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                      marginTop: '2px'
                    }}
                  >
                    {track.artist}
                  </span>
                </div>

                {/* Context Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onContextMenu(e, track);
                  }}
                  title="More options"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8c92a4',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Albums & singles Section */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Albums & singles
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
            gap: '18px'
          }}
        >
          {SEED_ALBUMS.map((alb) => (
            <div
              key={alb.id}
              onClick={() => {
                // Play first matching or related track
                const match = tracks.find(t => t.title.toLowerCase().includes(alb.title.toLowerCase().split(' ')[0])) || tracks[0];
                if (match) onPlayTrack(match);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <img
                src={alb.thumbnailUrl}
                alt={alb.title}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.45)'
                }}
              />
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {alb.title}
                </span>
                <span
                  style={{
                    fontSize: '12.5px',
                    color: '#8c92a4',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px'
                  }}
                >
                  {alb.type} · {alb.artist}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Listen again Section */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Listen again
          </h2>
          <span style={{ fontSize: '12px', color: '#8c92a4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            HARRMANE
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
            gap: '18px'
          }}
        >
          {tracks.slice(3, 9).map((track) => (
            <div
              key={`again-${track.id}`}
              onClick={() => onPlayTrack(track)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <img
                src={track.thumbnailUrl}
                alt={track.title}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.45)'
                }}
              />
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {track.title}
                </span>
                <span
                  style={{
                    fontSize: '12.5px',
                    color: '#8c92a4',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px'
                  }}
                >
                  {track.artist}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
