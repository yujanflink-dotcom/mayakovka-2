'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { VideoCard } from '@/components/VideoCard';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { CATEGORIES } from '@/lib/config';
import { VideoData } from '@/types';

export default function Home() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);

      const res = await fetch(`/api/videos?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setVideos(data.videos);
      if (data.lastRefreshed) setLastRefreshed(new Date(data.lastRefreshed));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar videos');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/refresh');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al actualizar');
      }
      await fetchVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredVideos = useMemo(() => {
    let result = videos;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.channelTitle?.toLowerCase() || '').includes(q),
      );
    }

    return result;
  }, [videos, searchQuery]);

  const groupedVideos = useMemo(() => {
    if (selectedCategory !== 'all') return null;

    const groups: Record<string, VideoData[]> = {};
    for (const video of filteredVideos) {
      if (!groups[video.category]) groups[video.category] = [];
      groups[video.category].push(video);
    }
    return groups;
  }, [filteredVideos, selectedCategory]);

  const sortedByDate = useMemo(
    () =>
      [...filteredVideos].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [filteredVideos],
  );

  const emptyMessage =
    selectedCategory !== 'all'
      ? 'Prueba a seleccionar otra categoria o cambia la busqueda'
      : 'Anade canales en la configuracion y ejecuta una actualizacion';

  return (
    <div className="min-h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastRefreshed={lastRefreshed}
        videoCount={filteredVideos.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <CategoryTabs
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <div className="aspect-video md:aspect-[21/9] bg-gray-900 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="aspect-video bg-gray-800" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchVideos}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">
                No hay videos todavia
              </p>
              <p className="text-gray-500 text-sm mb-6">{emptyMessage}</p>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-colors text-sm"
              >
                {refreshing ? 'Actualizando...' : 'Actualizar ahora'}
              </button>
            </div>
          ) : selectedCategory === 'all' && !searchQuery ? (
            <>
              <HeroSection videos={videos} />
              {CATEGORIES.filter(
                (c) => groupedVideos?.[c.id] && groupedVideos[c.id].length > 0,
              ).map((cat) => (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  videos={groupedVideos![cat.id]}
                  onViewAll={setSelectedCategory}
                />
              ))}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video, i) => (
                <VideoCard key={video.videoId} video={video} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
