import React from 'react';
import { ArrowLeft, CheckCircle2, Play, Users } from 'lucide-react';
import { Artist, Track } from '../types';
import { TrackRow } from '../components/TrackRow';

interface ArtistScreenProps {
  artist: Artist;
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onContextMenu: (e: React.MouseEvent, track: Track) => void;
  onBack: () => void;
}

export const ArtistScreen: React.FC<ArtistScreenProps> = ({
  artist,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onToggleLike,
  onContextMenu,
  onBack
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      <div>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '6px 14px', fontSize: '13px' }}>
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      {/* Artist Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        minHeight: '260px',
        padding: '36px',
        display: 'flex',
        alignItems: 'flex-end',
        background: 'linear-gradient(180deg, rgba(8, 11, 18, 0.2) 0%, rgba(8, 11, 18, 0.95) 100%)',
        border: '1px solid var(--color-border-subtle)'
      }}>
        {artist.bannerUrl && (
          <img
            src={artist.bannerUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: 0.6
            }}
          />
        )}

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img
            src={artist.thumbnailUrl}
            alt={artist.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(0, 229, 255, 0.5)',
              boxShadow: 'var(--shadow-card)'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                Verified Creator
              </span>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {artist.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} />
                <span>{artist.monthlyListeners || '1.2M'} monthly listeners</span>
              </span>
              <span>•</span>
              <span>{artist.subscribersCount || '450K'} subscribers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio / About */}
      {artist.description && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '720px' }}>
          {artist.description}
        </p>
      )}

      {/* Popular Tracks */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
            Popular Tracks
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {artist.topTracks.map((track, idx) => (
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
            />
          ))}
        </div>
      </section>

      {/* Discography / Albums */}
      {artist.albums && artist.albums.length > 0 && (
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '16px' }}>
            Discography
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {artist.albums.map(alb => (
              <div
                key={alb.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <img
                  src={alb.thumbnailUrl}
                  alt={alb.title}
                  style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                  {alb.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {alb.year} • {alb.trackCount} tracks
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
