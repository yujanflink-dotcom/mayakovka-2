import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => name === 'entry',
});

interface RSSVideoResult {
  videoId: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
}

export async function getChannelVideosRSS(
  channelId: string,
  maxResults = 15,
): Promise<RSSVideoResult[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IADashboard/1.0)',
      Accept: 'application/atom+xml',
    },
    next: {
      revalidate: 21600,
      tags: ['rss-feeds'],
    },
  });

  if (!res.ok) {
    throw new Error(`RSS error ${res.status} for channel ${channelId}`);
  }

  const xml = await res.text();
  if (!xml.trim()) return [];

  const data = parser.parse(xml);
  if (!data?.feed) return [];

  const entries = data.feed.entry || [];
  const entriesArray = Array.isArray(entries) ? entries : [entries];
  const channelTitle = data.feed.title || '';
  const feedChannelId = data.feed['yt:channelId'] || channelId;

  return entriesArray.slice(0, maxResults).map((entry: any) => {
    const videoId = entry['yt:videoId'] || '';
    const thumbFromFeed = entry['media:group']?.['media:thumbnail']?.['@_url'];
    const constructedThumb = videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : '';

    return {
      videoId,
      title: entry.title || '',
      description: entry['media:group']?.['media:description'] || '',
      channelId: entry['yt:channelId'] || feedChannelId,
      channelTitle: entry.author?.name || channelTitle,
      thumbnailUrl: thumbFromFeed || constructedThumb,
      publishedAt: entry.published || '',
    };
  });
}
