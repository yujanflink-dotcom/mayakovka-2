export interface VideoData {
  videoId: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  category: string;
}

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  description: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  channels: string[];
  keywords: string[];
  type?: 'video' | 'news';
}

export interface VideoState {
  read?: boolean;
  favorited?: boolean;
}
