import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import Anthropic from '@anthropic-ai/sdk';
import { unstable_cache } from 'next/cache';

const SYSTEM_PROMPT = `Eres un asistente que resume videos de YouTube en español.
Genera un resumen de 4 a 6 puntos clave en formato de lista (bullet points).
Cada punto debe ser conciso, con la informacion de mayor valor del video.
Sin paja, sin relleno, sin introduccion ni conclusion. Solo los puntos.`;

async function fetchTranscript(videoId: string): Promise<string> {
  const segments = await YoutubeTranscript.fetchTranscript(videoId);
  return segments.map((s) => s.text).join(' ');
}

async function generateSummary(transcript: string): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  });

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20250416',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: transcript }],
  });

  return msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

const getCachedSummary = unstable_cache(
  async (videoId: string) => {
    const transcript = await fetchTranscript(videoId);
    const summary = await generateSummary(transcript);
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY no configurada' },
      { status: 500 },
    );
  }

  try {
    const result = await getCachedSummary(videoId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (
        err.message.toLowerCase().includes('disabled') ||
        err.message.toLowerCase().includes('not available') ||
        err.message.toLowerCase().includes('transcript')
      ) {
        return NextResponse.json(
          {
            videoId,
            error:
              'Este video no tiene subtitulos disponibles para resumir',
          },
          { status: 404 },
        );
      }
    }
    console.error('Summarize error:', err);
    return NextResponse.json(
      { error: 'Error al generar resumen' },
      { status: 500 },
    );
  }
}
