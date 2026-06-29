import { XMLParser } from 'fast-xml-parser';
import { NewsItem } from '@/types';

const rssParser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === 'item',
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

interface NewsSource {
  name: string;
  url: string;
}

const NEWS_SOURCES: NewsSource[] = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  {
    name: 'Anthropic',
    url: 'https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml',
  },
];

async function getNewsFeed(source: NewsSource): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IADashboard/1.0)',
    },
    next: {
      revalidate: 21600,
      tags: ['rss-feeds'],
    },
  });

  if (!res.ok) {
    throw new Error(`RSS error ${res.status} for ${source.name}`);
  }

  const xml = await res.text();
  if (!xml.trim()) return [];

  const data = rssParser.parse(xml);
  const channel = data?.rss?.channel;
  if (!channel?.item) return [];

  const items = Array.isArray(channel.item) ? channel.item : [channel.item];

  return items.map((item: any) => ({
    title: item.title || '',
    link: item.link || '',
    source: source.name,
    publishedAt: item.pubDate || '',
    description: stripHtml(item.description || ''),
  }));
}

export async function getAllNews(): Promise<NewsItem[]> {
  const results: NewsItem[] = [];

  for (const source of NEWS_SOURCES) {
    try {
      const items = await getNewsFeed(source);
      results.push(...items);
    } catch (err) {
      console.error(`Error fetching news from ${source.name}:`, err);
    }
  }

  results.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return results;
}
