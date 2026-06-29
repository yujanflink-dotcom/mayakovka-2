'use client';

import { useEffect, useState, useRef } from 'react';
import { RefreshCw, Search, Youtube, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  itemCount: number;
}

export function Header({
  searchQuery,
  onSearchChange,
  onRefresh,
  refreshing,
  itemCount,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    onSearchChange('');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-14 md:h-16 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-gray-950/80 backdrop-blur-xl border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-gray-950 border-transparent'
        }`}
      >
        <div className="h-full max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between gap-1 md:gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <Youtube size={20} className="text-red-500 md:size-[24]" />
            <h1 className="text-sm font-bold hidden sm:block">IA Dashboard</h1>
          </div>

          <div className="hidden md:block flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar videos o noticias..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700/50 rounded-xl text-sm
                         placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                         transition-all backdrop-blur-sm"
            />
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl
                         active:bg-gray-800/80 transition-colors text-gray-400"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            <span className="text-xs tabular-nums text-gray-500 min-w-[36px] md:min-w-[44px] min-h-[44px] flex items-center justify-center">
              {itemCount}
            </span>

            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl
                         active:bg-gray-800/80 transition-colors text-gray-400 disabled:opacity-50"
              title="Actualizar"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed left-0 right-0 top-14 md:hidden z-[60] bg-gray-950 border-b border-gray-800 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar videos o noticias..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-base
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <button
              onClick={handleSearchClose}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-sm font-medium text-blue-400 active:text-blue-300"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
