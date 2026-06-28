'use client';

import { useMemo } from 'react';
import { VideoData } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeroSectionProps {
  videos: VideoData[];
}

export function HeroSection({ videos }: HeroSectionProps) {
  const sorted = useMemo(
    () =>
      [...videos].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [videos],
  );

  const latest = sorted[0];
  const recent = sorted.slice(1, 6);

  if (!latest) return null;

  const isNew =
    Date.now() - new Date(latest.publishedAt).getTime() < 48 * 60 * 60 * 1000;

  const openVideo = (videoId: string) => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section className="mb-10">
      <div
        onClick={() => openVideo(latest.videoId)}
        className="relative rounded-2xl overflow-hidden mb-5 cursor-pointer group animate-fade-in-up"
      >
        <div className="aspect-video md:aspect-[21/9] relative bg-gray-800">
          {latest.thumbnailUrl ? (
            <img
              src={latest.thumbnailUrl}
              alt={latest.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Sin miniatura
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {isNew && (
              <span className="inline-block px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-md mb-3">
                NUEVO
              </span>
            )}
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
              {latest.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              {latest.channelTitle}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {formatDistanceToNow(new Date(latest.publishedAt), {
                addSuffix: true,
                locale: es,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recent.map((v, i) => (
          <div
            key={v.videoId}
            onClick={() => openVideo(v.videoId)}
            className="flex-shrink-0 w-44 sm:w-52 cursor-pointer group animate-fade-in-up"
            style={{ animationDelay: `${(i + 1) * 80}ms` }}
          >
            <div className="aspect-video rounded-xl overflow-hidden mb-2 relative bg-gray-800">
              {v.thumbnailUrl ? (
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                  Sin miniatura
                </div>
              )}
              {v.duration && (
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-xs font-medium rounded">
                  {v.duration}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
              {v.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {v.channelTitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
