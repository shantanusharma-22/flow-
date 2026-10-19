import React from 'react';
import { Play } from 'lucide-react';

interface MediaCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  type?: 'playlist' | 'album' | 'artist';
  onClick: () => void;
  onPlayClick?: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  type = 'playlist',
  onClick,
  onPlayClick
}) => {
  return (
    <div
      className={`media-card ${type === 'artist' ? 'artist' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <div className="media-artwork-box">
        <img
          src={imageUrl}
          alt={title}
          className="media-artwork-img"
          loading="lazy"
        />
        {onPlayClick && (
          <button
            className="card-play-fab"
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick();
            }}
            aria-label={`Play ${title}`}
          >
            <Play size={20} fill="#040711" style={{ marginLeft: '2px' }} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className="media-card-title">{title}</span>
        <span className="media-card-subtitle">{subtitle}</span>
      </div>
    </div>
  );
};
