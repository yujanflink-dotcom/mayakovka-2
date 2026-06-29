import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    revalidateTag('rss-feeds');
    return NextResponse.json({ success: true, message: 'Caché revalidado' });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: 'Error al revalidar caché' },
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
    revalidateTag('rss-feeds');
    return NextResponse.json({ success: true, message: 'Caché revalidado' });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json(
      { error: 'Error al revalidar caché' },
      { status: 500 },
    );
  }
}
