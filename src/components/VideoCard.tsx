'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { VideoData, VideoState } from '@/types';
import { CATEGORY_COLORS, CATEGORY_COLORS_RGB } from '@/lib/colors';

interface VideoCardProps {
  video: VideoData;
  index?: number;
}

function getStoredStates(): Record<string, VideoState> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('videoStates') || '{}');
  } catch {
    return {};
  }
}

function setStoredState(videoId: string, state: VideoState) {
  const states = getStoredStates();
  states[videoId] = { ...states[videoId], ...state };
  localStorage.setItem('videoStates', JSON.stringify(states));
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  const [favorited, setFavorited] = useState(false);
  const color = CATEGORY_COLORS[video.category] || '#3B82F6';
  const rgb = CATEGORY_COLORS_RGB[video.category] || '59,130,246';

  useEffect(() => {
    const states = getStoredStates();
    setFavorited(!!states[video.videoId]?.favorited);
  }, [video.videoId]);

  const handleClick = () => {
    setStoredState(video.videoId, { read: true });
    window.open(
      `https://www.youtube.com/watch?v=${video.videoId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next);
    setStoredState(video.videoId, { favorited: next });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 hover:scale-[1.02] transition-all duration-200 cursor-pointer animate-fade-in-up"
      style={{
        borderTopColor: color,
        borderTopWidth: '2px',
        boxShadow: `0 0 0 0 rgba(${rgb},0)`,
        animationDelay: `${index * 50}ms`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(${rgb},0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Sin miniatura
          </div>
        )}

        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-xs font-medium rounded">
            {video.duration}
          </span>
        )}

        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100
                     hover:bg-black/70 transition-all duration-200 backdrop-blur-sm"
          aria-label={favorited ? 'Quitar de favoritos' : 'Anadir a favoritos'}
        >
          <Heart
            size={16}
            className={
              favorited
                ? 'fill-red-500 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]'
                : 'text-white'
            }
          />
        </button>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-bold leading-snug line-clamp-2 transition-colors duration-200"
            style={{ color }}>
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {video.channelTitle && (
            <span className="truncate">{video.channelTitle}</span>
          )}
          <span>&middot;</span>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(video.publishedAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
