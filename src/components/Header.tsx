'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Search, Youtube } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  lastRefreshed: Date | null;
  videoCount: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  onRefresh,
  refreshing,
  lastRefreshed,
  videoCount,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-gray-950/80 backdrop-blur-xl border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Youtube size={24} className="text-red-500" />
          <h1 className="text-lg font-bold hidden sm:block">IA Dashboard</h1>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar videos por titulo o canal..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700/50 rounded-xl text-sm
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                       transition-all backdrop-blur-sm"
          />
        </div>

        {lastRefreshed && (
          <span className="text-xs text-gray-500 hidden lg:block shrink-0">
            Actualizado{' '}
            {formatDistanceToNow(lastRefreshed, { addSuffix: true, locale: es })}
          </span>
        )}

        <span className="text-xs text-gray-500 shrink-0">{videoCount}</span>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 disabled:opacity-50 transition-all shrink-0 backdrop-blur-sm"
          title="Actualizar videos"
        >
          <RefreshCw size={18} className={`text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
