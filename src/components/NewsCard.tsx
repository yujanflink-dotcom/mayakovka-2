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

  const maxDescLength = 250;
  const truncatedDesc =
    item.description.length > maxDescLength
      ? item.description.slice(0, maxDescLength) + '...'
      : item.description;

  return (
    <div
      onClick={openArticle}
      className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 hover:scale-[1.02] transition-all duration-200 cursor-pointer animate-fade-in-up"
      style={{
        borderTopColor: '#14B8A6',
        borderTopWidth: '2px',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Newspaper size={14} className="text-teal-400 shrink-0" />
          <span className="font-medium text-teal-400">{item.source}</span>
          <span>&middot;</span>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(item.publishedAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>

        <h3 className="text-sm font-bold leading-snug line-clamp-2 text-white group-hover:text-teal-400 transition-colors">
          {item.title}
        </h3>

        {truncatedDesc && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
            {truncatedDesc}
          </p>
        )}
      </div>
    </div>
  );
}
