import React, { useState } from 'react';
import { Play, Sparkles, TrendingUp, Compass, Headphones } from 'lucide-react';
import { Track, Playlist, Artist } from '../types';
import { TrackRow } from '../components/TrackRow';
import { MediaCard } from '../components/MediaCard';

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
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const moods = ['All', 'Focus', 'Cyberpunk', 'Late Night Lo-Fi', 'Cosmic Ambient', 'Energy'];

  const heroTrack = tracks[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      {/* Hero Featured Release Banner */}
      {heroTrack && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center',
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.16) 0%, rgba(168, 85, 247, 0.22) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Subtle background glow image */}
          <img
            src={heroTrack.thumbnailUrl}
            alt=""
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '380px',
              height: '380px',
              objectFit: 'cover',
              borderRadius: '50%',
              opacity: 0.35,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-accent)',
                padding: '3px 8px',
                background: 'rgba(0, 229, 255, 0.15)',
                borderRadius: 'var(--radius-pill)'
              }}>
                Featured Premiere
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} style={{ color: 'var(--color-warning)' }} />
                <span>FLAC Lossless Master</span>
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {heroTrack.title}
            </h1>

            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              By <strong style={{ color: '#ffffff', cursor: 'pointer' }} onClick={() => heroTrack.artistId && onArtistClick(heroTrack.artistId)}>{heroTrack.artist}</strong>.
              Experience dynamic animated lyrics with Romaji transliteration and seamless zero-loss streaming.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <button
                className="btn-primary"
                onClick={() => onPlayTrack(heroTrack)}
              >
                <Play size={18} fill="#040711" />
                <span>Stream Now</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => onPlaylistClick('playlist-01')}
              >
                <Headphones size={16} />
                <span>Open Discover Mix</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood & Activity Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {moods.map(mood => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid',
              borderColor: selectedMood === mood ? 'var(--color-accent)' : 'var(--color-border-subtle)',
              background: selectedMood === mood ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedMood === mood ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Quick Picks (Instant Listening Tracks) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              Quick Picks
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-faint)' }}>
            Selected for your flow
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: '8px'
        }}>
          {tracks.slice(0, 8).map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              isLiked={likedTrackIds.has(track.id)}
              onPlay={onPlayTrack}
              onToggleLike={onToggleLike}
              onContextMenu={onContextMenu}
              onArtistClick={onArtistClick}
            />
          ))}
        </div>
      </section>

      {/* Trending Hits & New Releases (Apple Music Style Horizontal Cards) */}
      {tracks.length > 8 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--color-accent)' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
                Trending Hits & New Releases
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-faint)' }}>
              Live from YouTube Music
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {tracks.slice(8, 24).map(track => (
              <MediaCard
                key={track.id}
                title={track.title}
                subtitle={track.artist}
                imageUrl={track.thumbnailUrl}
                type="album"
                onClick={() => onPlayTrack(track)}
                onPlayClick={() => onPlayTrack(track)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Playlists Carousel */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} style={{ color: 'var(--color-accent-violet)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              Featured Playlists
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {playlists.map(pl => (
            <MediaCard
              key={pl.id}
              title={pl.title}
              subtitle={pl.description || `${pl.tracks.length} tracks`}
              imageUrl={pl.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
              type="playlist"
              onClick={() => onPlaylistClick(pl.id)}
              onPlayClick={() => onPlayPlaylist(pl)}
            />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
            Trending Creators
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {artists.map(art => (
            <MediaCard
              key={art.id}
              title={art.name}
              subtitle={`${art.monthlyListeners || art.subscribersCount} listeners`}
              imageUrl={art.thumbnailUrl}
              type="artist"
              onClick={() => onArtistClick(art.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
