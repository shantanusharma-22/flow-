import React, { useState, useMemo } from 'react';
import { Search, Clock, Trash2, Music, Disc, User, ListMusic } from 'lucide-react';
import { Track, Playlist, Artist } from '../types';
import { TrackRow } from '../components/TrackRow';
import { MediaCard } from '../components/MediaCard';

interface SearchScreenProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onContextMenu: (e: React.MouseEvent, track: Track) => void;
  onPlaylistClick: (playlistId: string) => void;
  onArtistClick: (artistId: string) => void;
}

type FilterCategory = 'all' | 'songs' | 'artists' | 'playlists';

export const SearchScreen: React.FC<SearchScreenProps> = ({
  searchQuery,
  onSearchChange,
  recentSearches,
  onClearRecentSearches,
  tracks,
  playlists,
  artists,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onToggleLike,
  onContextMenu,
  onPlaylistClick,
  onArtistClick
}) => {
  const [activeTab, setActiveTab] = useState<FilterCategory>('all');

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return tracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      (t.album && t.album.toLowerCase().includes(q)) ||
      t.lyrics?.lines.some(l => l.text.toLowerCase().includes(q) || (l.romanized && l.romanized.toLowerCase().includes(q)))
    );
  }, [searchQuery, tracks]);

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return artists.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q))
    );
  }, [searchQuery, artists]);

  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return playlists.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }, [searchQuery, playlists]);

  const hasResults = filteredTracks.length > 0 || filteredArtists.length > 0 || filteredPlaylists.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '12px' }}>
        <button
          className="btn-secondary"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderColor: activeTab === 'all' ? 'var(--color-accent)' : undefined,
            color: activeTab === 'all' ? 'var(--color-accent)' : undefined,
            background: activeTab === 'all' ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
        >
          All Results
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTab('songs')}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderColor: activeTab === 'songs' ? 'var(--color-accent)' : undefined,
            color: activeTab === 'songs' ? 'var(--color-accent)' : undefined,
            background: activeTab === 'songs' ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
        >
          <Music size={14} />
          <span>Songs ({filteredTracks.length})</span>
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTab('artists')}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderColor: activeTab === 'artists' ? 'var(--color-accent)' : undefined,
            color: activeTab === 'artists' ? 'var(--color-accent)' : undefined,
            background: activeTab === 'artists' ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
        >
          <User size={14} />
          <span>Artists ({filteredArtists.length})</span>
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTab('playlists')}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            borderColor: activeTab === 'playlists' ? 'var(--color-accent)' : undefined,
            color: activeTab === 'playlists' ? 'var(--color-accent)' : undefined,
            background: activeTab === 'playlists' ? 'rgba(0, 229, 255, 0.12)' : undefined
          }}
        >
          <ListMusic size={14} />
          <span>Playlists ({filteredPlaylists.length})</span>
        </button>
      </div>

      {/* If Empty Query: Show Recent Searches */}
      {!searchQuery.trim() ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--color-accent)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>
                Recent Searches
              </h2>
            </div>
            {recentSearches.length > 0 && (
              <button
                className="btn-icon"
                onClick={onClearRecentSearches}
                style={{ fontSize: '12px', gap: '4px', color: 'var(--color-text-faint)' }}
                title="Clear Search History"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((term, i) => (
              <button
                key={i}
                className="btn-secondary"
                onClick={() => onSearchChange(term)}
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                <Search size={13} style={{ opacity: 0.6 }} />
                <span>{term}</span>
              </button>
            ))}
          </div>

          {/* Browse Categories Prompt */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              Popular Genres & Moods
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Lo-Fi Chillhop', bg: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' },
                { name: 'Cyberpunk & Synth', bg: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 100%)' },
                { name: 'Ambient Cosmos', bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
                { name: 'Neo Classical', bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }
              ].map(cat => (
                <div
                  key={cat.name}
                  onClick={() => onSearchChange(cat.name.split(' ')[0])}
                  style={{
                    height: '90px',
                    borderRadius: 'var(--radius-lg)',
                    background: cat.bg,
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !hasResults ? (
        /* No Results State */
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-faint)' }}>
          <Search size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            No results found for "{searchQuery}"
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            Check spelling or try searching for a different artist, song title, or genre.
          </p>
        </div>
      ) : (
        /* Populated Search Results */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Top Result Card if artist matches */}
          {(activeTab === 'all' || activeTab === 'artists') && filteredArtists.length > 0 && (
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>
                Top Artist Result
              </h2>
              <div
                onClick={() => onArtistClick(filteredArtists[0].id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  maxWidth: '540px',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={filteredArtists[0].thumbnailUrl}
                  alt={filteredArtists[0].name}
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700 }}>
                    Artist Profile
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>
                    {filteredArtists[0].name}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {filteredArtists[0].monthlyListeners} monthly listeners
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Songs Results */}
          {(activeTab === 'all' || activeTab === 'songs') && filteredTracks.length > 0 && (
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>
                Songs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredTracks.map((track, idx) => (
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
          )}

          {/* Playlists Results */}
          {(activeTab === 'all' || activeTab === 'playlists') && filteredPlaylists.length > 0 && (
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>
                Playlists
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {filteredPlaylists.map(pl => (
                  <MediaCard
                    key={pl.id}
                    title={pl.title}
                    subtitle={`${pl.tracks.length} tracks`}
                    imageUrl={pl.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'}
                    type="playlist"
                    onClick={() => onPlaylistClick(pl.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
