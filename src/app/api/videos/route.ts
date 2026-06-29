import { NextRequest, NextResponse } from 'next/server';
import { getChannelVideosRSS } from '@/lib/youtube';
import { CATEGORIES, CONFIG } from '@/lib/config';

export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get('category') || 'all';

  try {
    const categoriesToFetch =
      categoryParam === 'all'
        ? CATEGORIES
        : CATEGORIES.filter((c) => c.id === categoryParam);

    const allVideos: Array<{
      videoId: string;
      title: string;
      description: string;
      channelId: string;
      channelTitle: string;
      thumbnailUrl: string;
      publishedAt: string;
      category: string;
    }> = [];
    const seenIds = new Set<string>();

    for (const category of categoriesToFetch) {
      if (category.channels.length === 0) continue;

      for (const channelId of category.channels) {
        try {
          const videos = await getChannelVideosRSS(channelId, CONFIG.videosPerChannel);
          for (const v of videos) {
            if (!seenIds.has(v.videoId)) {
              seenIds.add(v.videoId);
              allVideos.push({ ...v, category: category.id });
            }
          }
        } catch (err) {
          console.error(`Error fetching RSS for channel ${channelId}:`, err);
        }
      }
    }

    allVideos.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return NextResponse.json({
      videos: allVideos,
      lastRefreshed: null,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos' },
      { status: 500 },
    );
  }
}
