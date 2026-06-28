import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') || 'all';

  try {
    const where: Record<string, unknown> = {};
    if (category !== 'all') {
      where.category = category;
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    const meta = await prisma.cacheMeta.findUnique({
      where: { id: 'singleton' },
    });

    return NextResponse.json({
      videos,
      lastRefreshed: meta?.lastRefreshed || null,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos' },
      { status: 500 },
    );
  }
}
