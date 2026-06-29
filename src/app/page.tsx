'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { VideoCard } from '@/components/VideoCard';
import { NewsCard } from '@/components/NewsCard';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { CATEGORIES } from '@/lib/config';
import { VideoData, NewsItem } from '@/types';

export default function Home() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar videos');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setNews(data.news);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar noticias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory === 'noticias') {
      fetchNews();
    } else {
      fetchVideos();
    }
  }, [selectedCategory, fetchVideos, fetchNews]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/refresh');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al actualizar');
      }
      if (selectedCategory === 'noticias') {
        await fetchNews();
      } else {
        await fetchVideos();
      }
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

    if (timeFilter === '24h') {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      result = result.filter(
        (v) => new Date(v.publishedAt).getTime() > cutoff,
      );
    } else if (timeFilter === 'week') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (v) => new Date(v.publishedAt).getTime() > cutoff,
      );
    }

    return result;
  }, [videos, searchQuery, timeFilter]);

  const filteredNews = useMemo(() => {
    let result = news;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q),
      );
    }

    if (timeFilter === '24h') {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      result = result.filter(
        (item) => new Date(item.publishedAt).getTime() > cutoff,
      );
    } else if (timeFilter === 'week') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (item) => new Date(item.publishedAt).getTime() > cutoff,
      );
    }

    return result;
  }, [news, searchQuery, timeFilter]);

  const groupedVideos = useMemo(() => {
    if (selectedCategory !== 'all') return null;

    const groups: Record<string, VideoData[]> = {};
    for (const video of filteredVideos) {
      if (!groups[video.category]) groups[video.category] = [];
      groups[video.category].push(video);
    }
    return groups;
  }, [filteredVideos, selectedCategory]);

  const displayCount =
    selectedCategory === 'noticias' ? filteredNews.length : filteredVideos.length;

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
        itemCount={displayCount}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <CategoryTabs
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="mt-6">
          {loading ? (
            selectedCategory === 'noticias' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={selectedCategory === 'noticias' ? fetchNews : fetchVideos}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          ) : selectedCategory === 'noticias' ? (
            filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-2">
                  No hay noticias disponibles
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Los feeds RSS se actualizan cada pocas horas
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl transition-colors text-sm"
                >
                  {refreshing ? 'Actualizando...' : 'Actualizar ahora'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredNews.map((item, i) => (
                  <NewsCard key={item.link} item={item} index={i} />
                ))}
              </div>
            )
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
              <HeroSection videos={filteredVideos} />
              {CATEGORIES.filter(
                (c) =>
                  c.type !== 'news' &&
                  groupedVideos?.[c.id] &&
                  groupedVideos[c.id].length > 0,
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
