import { NextResponse } from 'next/server';
import { getAllNews } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 },
    );
  }
}
