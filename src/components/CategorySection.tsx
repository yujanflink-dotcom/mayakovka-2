'use client';

import { VideoData, CategoryConfig } from '@/types';
import { VideoCard } from './VideoCard';
import { CATEGORY_COLORS } from '@/lib/colors';

interface CategorySectionProps {
  category: CategoryConfig;
  videos: VideoData[];
  onViewAll: (categoryId: string) => void;
}

export function CategorySection({ category, videos, onViewAll }: CategorySectionProps) {
  if (videos.length === 0) return null;

  const color = CATEGORY_COLORS[category.id] || '#3B82F6';
  const displayVideos = videos.slice(0, 8);
  const remaining = videos.length - 8;

  return (
    <section className="mb-8 md:mb-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-3">
          <span
            className="w-1 h-5 md:h-6 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h2 className="text-lg md:text-xl font-bold" style={{ color }}>
            {category.name}
          </h2>
        </div>
        {videos.length > 8 && (
          <button
            onClick={() => onViewAll(category.id)}
            className="text-sm text-gray-400 active:text-white transition-colors px-3 py-1.5 rounded-lg active:bg-gray-800 min-h-[44px] flex items-center"
          >
            Ver todos
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {displayVideos.map((v, i) => (
          <VideoCard key={v.videoId} video={v} index={i} />
        ))}
      </div>
      {videos.length > 8 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => onViewAll(category.id)}
            className="w-full md:w-auto px-6 py-3 md:py-2 text-sm rounded-xl border border-gray-700 text-gray-400
                       active:border-gray-500 active:text-white transition-all min-h-[44px]"
          >
            Ver todos los {videos.length} videos
          </button>
        </div>
      )}
    </section>
  );
}
