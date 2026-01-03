export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  medium: string;
  dimensions?: string;
  year?: number;
  price?: number;
  sold?: boolean;
  featured: boolean;
  orientation: 'portrait' | 'landscape' | 'square';
  category?: string;
  tags?: string[];
}
