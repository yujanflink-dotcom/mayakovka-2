import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { unstable_cache } from 'next/cache';

const PROMPT = `Resume este video de YouTube en 4 a 6 puntos clave en español.
Cada punto debe ser conciso, con la informacion de mayor valor del video.
Sin paja, sin relleno, sin introduccion ni conclusion. Solo los puntos.`;

async function generateSummary(videoId: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: PROMPT,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              mimeType: 'video/*',
              fileUri: `https://www.youtube.com/watch?v=${videoId}`,
            },
          },
        ],
      },
    ],
  });

  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Respuesta vacia del modelo');
  }

  return text;
}

const getCachedSummary = unstable_cache(
  async (videoId: string) => {
    const summary = await generateSummary(videoId);
    return { videoId, summary };
  },
  ['video-summary'],
  { revalidate: 604800, tags: ['summary'] },
);

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('videoId');
  if (!videoId) {
    return NextResponse.json({ error: 'Falta videoId' }, { status: 400 });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_API_KEY no configurada' },
      { status: 500 },
    );
  }

  try {
    const result = await getCachedSummary(videoId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message.toLowerCase() : '';
    if (
      msg.includes('not found') ||
      msg.includes('unavailable') ||
      msg.includes('private') ||
      msg.includes('permission') ||
      msg.includes('not supported')
    ) {
      return NextResponse.json(
        {
          videoId,
          error:
            'Gemini no pudo procesar este video. Puede ser privado, no disponible o muy extenso.',
        },
        { status: 404 },
      );
    }
    console.error('Summarize error:', err);
    return NextResponse.json(
      { error: 'Error al generar resumen' },
      { status: 500 },
    );
  }
}
