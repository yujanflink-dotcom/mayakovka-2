import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getChannelVideosRSS } from '@/lib/youtube';
import { CATEGORIES, CONFIG } from '@/lib/config';

async function doRefresh() {
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

  for (const category of CATEGORIES) {
    if (category.channels.length === 0) {
      console.warn(`Category "${category.name}" has no channels configured — skipping`);
      continue;
    }

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

  for (const video of allVideos) {
    try {
      await prisma.video.upsert({
        where: { videoId: video.videoId },
        update: {
          title: video.title,
          description: video.description,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: new Date(video.publishedAt),
          duration: null,
          category: video.category,
        },
        create: {
          videoId: video.videoId,
          title: video.title,
          description: video.description,
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          thumbnailUrl: video.thumbnailUrl,
          publishedAt: new Date(video.publishedAt),
          duration: null,
          category: video.category,
        },
      });
    } catch (err) {
      console.error(`Error saving video ${video.videoId}:`, err);
    }
  }

  await prisma.cacheMeta.upsert({
    where: { id: 'singleton' },
    update: { lastRefreshed: new Date() },
    create: { id: 'singleton', lastRefreshed: new Date() },
  });

  return { videosFetched: allVideos.length };
}

export async function GET() {
  try {
    const meta = await prisma.cacheMeta.findUnique({
      where: { id: 'singleton' },
    });

    if (meta?.lastRefreshed) {
      const minutesSince = (Date.now() - meta.lastRefreshed.getTime()) / 60000;
      if (minutesSince < 5) {
        return NextResponse.json(
          {
            error: `Espera ${Math.ceil(5 - minutesSince)} min antes de actualizar de nuevo`,
          },
          { status: 429 },
        );
      }
    }

    const result = await doRefresh();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar videos' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await doRefresh();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar videos' },
      { status: 500 },
    );
  }
}
