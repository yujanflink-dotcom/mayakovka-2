'use client';

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Newspaper } from 'lucide-react';
import { NewsItem } from '@/types';

interface NewsCardProps {
  item: NewsItem;
  index?: number;
}

export function NewsCard({ item, index = 0 }: NewsCardProps) {
  const openArticle = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const maxDescLength = 200;
  const truncatedDesc =
    item.description.length > maxDescLength
      ? item.description.slice(0, maxDescLength) + '...'
      : item.description;

  return (
    <div
      onClick={openArticle}
      className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 active:scale-[0.97] transition-all duration-150 cursor-pointer animate-fade-in-up"
      style={{
        borderTopColor: '#14B8A6',
        borderTopWidth: '2px',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Newspaper size={16} className="text-teal-400 shrink-0" />
          <span className="font-medium text-teal-400">{item.source}</span>
          <span>&middot;</span>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(item.publishedAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>

        <h3 className="text-base font-bold leading-snug line-clamp-2 text-white">
          {item.title}
        </h3>

        {truncatedDesc && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {truncatedDesc}
          </p>
        )}
      </div>
    </div>
  );
}
