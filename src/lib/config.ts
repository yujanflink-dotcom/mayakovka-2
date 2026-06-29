import { CategoryConfig } from '@/types';

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'noticias',
    name: 'Noticias',
    description: 'Articulos y anuncios oficiales de OpenAI, Anthropic y mas',
    channels: [],
    keywords: [],
    type: 'news',
  },
  {
    id: 'general-news',
    name: 'Noticias generales',
    description: 'Lanzamientos, anuncios y eventos del sector IA',
    channels: [
      'UCxcDzs-4quJV4QsairlFYNg',
      'UCX_dT6nVtCIHRo_GFOsWK2A',
      'UCl5-lvQyfILb-l2abPk4Ntg',
    ],
    keywords: [
      'inteligencia artificial noticias 2025',
      'AI news latest breakthrough',
      'artificial intelligence update',
    ],
  },
  {
    id: 'models',
    name: 'Modelos y updates',
    description: 'Nuevos modelos, versiones, benchmarks y comparativas',
    channels: [],
    keywords: [
      'GPT Claude Gemini Llama comparison',
      'new AI model release 2025',
      'AI benchmark results',
    ],
  },
  {
    id: 'coding-tools',
    name: 'Herramientas de codigo',
    description: 'Claude Code, Cursor, Copilot, agentes de IA para programar',
    channels: [
      'UCV03SRZXJEz-hchIAogeJOg',
      'UCrDwWp7EBBv4NwvScIpBDOA',
      'UCpq8lHHliCS3oBt-gfL0bKQ',
      'UCxPD7bsocoAMq8Dj18kmGyQ',
    ],
    keywords: [
      'Claude Code Cursor Copilot AI coding',
      'AI programming agent 2025',
      'AI developer tools',
    ],
  },
  {
    id: 'image-gen',
    name: 'Generacion de imagenes',
    description: 'Midjourney, DALL-E, Stable Diffusion y generacion visual',
    channels: [],
    keywords: [
      'Midjourney DALL-E Stable Diffusion AI',
      'AI image generation 2025',
      'AI art tutorial',
    ],
  },
  {
    id: 'video-gen',
    name: 'Generacion de video',
    description: 'Sora, Runway, Veo, Kling y video con IA',
    channels: [],
    keywords: [
      'Sora Runway Veo AI video generation',
      'text to video AI 2025',
      'AI video generator',
    ],
  },
  {
    id: 'business',
    name: 'Negocio y economia',
    description: 'Inversiones, empresas, mercado laboral e impacto economico',
    channels: [
      'UCVt4ugq2txl_szlXAO7B3-g',
      'UCh0yfHiqN7Rt0jKlOKYjYXA',
    ],
    keywords: [
      'AI business investment 2025',
      'AI market analysis economy',
      'AI industry news',
    ],
  },
  {
    id: 'tutorials',
    name: 'Tutoriales practicos',
    description: 'Casos de uso, guias paso a paso y proyectos practicos con IA',
    channels: [
      'UC2ojq-nuP8ceeHqiroeKhBA',
      'UCERX0a6PiDc3gDVZ1Vf_tBw',
      'UCOu9pKHv94bFeRy5vzB-b1Q',
    ],
    keywords: [
      'AI tutorial step by step 2025',
      'AI project build from scratch',
      'practical AI use case',
    ],
  },
  {
    id: 'analysis',
    name: 'Analisis y opinion',
    description: 'Videos largos, entrevistas y analisis profundo de IA',
    channels: [],
    keywords: [
      'AI deep dive analysis 2025',
      'AI interview discussion future',
      'future of artificial intelligence',
    ],
  },
  {
    id: 'economia-ia',
    name: 'Economia de la IA',
    description: 'Impacto economico, inversiones y mercado laboral de la IA',
    channels: [
      'UCKC77AR_zWXRTE2GOD_2Uag',
    ],
    keywords: [
      'economia inteligencia artificial',
      'AI economy market impact',
    ],
  },
];

export const CONFIG = {
  refreshIntervalHours: 6,
  videosPerChannel: 5,
};
