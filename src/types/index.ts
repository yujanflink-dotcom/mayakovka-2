export interface VideoData {
  id: string;
  videoId: string;
  title: string;
  description: string | null;
  channelId: string | null;
  channelTitle: string | null;
  thumbnailUrl: string | null;
  publishedAt: string;
  duration: string | null;
  category: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  channels: string[];
  keywords: string[];
}

export interface VideoState {
  read?: boolean;
  favorited?: boolean;
}
