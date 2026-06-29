'use client';

import { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { VideoData, VideoState } from '@/types';
import { CATEGORY_COLORS } from '@/lib/colors';
import { SummaryModal } from './SummaryModal';

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
  const [showSummary, setShowSummary] = useState(false);
  const color = CATEGORY_COLORS[video.category] || '#3B82F6';

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

  const handleSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSummary(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                   active:scale-[0.97] transition-all duration-150 cursor-pointer animate-fade-in-up"
        style={{
          borderTopColor: color,
          borderTopWidth: '2px',
          animationDelay: `${index * 50}ms`,
        }}
      >
        <div className="relative aspect-video bg-gray-800 overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Sin miniatura
            </div>
          )}

          {video.duration && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-xs font-medium rounded-md">
              {video.duration}
            </span>
          )}

          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 flex items-center justify-center min-w-[40px] min-h-[40px]
                       rounded-xl bg-black/50 backdrop-blur-sm transition-all duration-200 active:scale-90"
            aria-label={favorited ? 'Quitar de favoritos' : 'Anadir a favoritos'}
          >
            <Heart
              size={18}
              className={
                favorited
                  ? 'fill-red-500 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]'
                  : 'text-white'
              }
            />
          </button>

          <button
            onClick={handleSummary}
            className="absolute top-2 left-2 flex items-center gap-1.5 min-h-[32px] px-2.5 py-1
                       rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-medium
                       backdrop-blur-sm transition-all active:scale-90"
          >
            <Sparkles size={14} />
            Ver resumen
          </button>
        </div>

        <div className="p-3 md:p-4 space-y-1.5">
          <h3 className="text-base font-bold leading-snug line-clamp-2" style={{ color }}>
            {video.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
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

      {showSummary && (
        <SummaryModal
          videoId={video.videoId}
          videoTitle={video.title}
          onClose={() => setShowSummary(false)}
        />
      )}
    </>
  );
}
