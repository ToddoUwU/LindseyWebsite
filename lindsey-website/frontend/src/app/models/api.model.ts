/**
 * Artwork model - matches backend Artwork entity
 */
export interface Artwork {
  id: number;
  title: string;
  artDescription: string;
  dimensions: string;
  smallImageUrl: string;
  smallImageWidth?: number;
  smallImageHeight?: number;
  mediumImageUrl: string;
  mediumImageWidth?: number;
  mediumImageHeight?: number;
  largeImageUrl: string;
  largeImageWidth?: number;
  largeImageHeight?: number;
  linkToPrint: string;
  dateProduced: string;
  originalPrice: number;
  forSale: boolean;
  location: string;
  medium: string;
  categories: string;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
  contentHash?: string;
}

/**
 * ArtworkProduct model - matches backend ArtworkProduct entity
 * Represents products associated with artwork (prints, merchandise, etc.)
 */
export interface ArtworkProduct {
  id: number;
  artworkId: number;
  artworkTitle?: string;        // For display purposes
  artworkImageUrl?: string;     // Fallback image from artwork
  description: string;
  productCategory: string;
  productUrl: string;
  price?: number;
  isAvailable: boolean;
  displayOrder: number;
  productImageUrl?: string;     // Product-specific image (mockup, etc.)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Home page data combining multiple API responses
 */
export interface HomePageData {
  featuredArtworks: Artwork[];
  artworksForSale: Artwork[];
  categories: string[];
  dimensions: string[];
  mediums: string[];
}

/**
 * Filter state for artwork filtering
 */
export interface ArtworkFilters {
  categories: string[];
  dimensions: string[];
  mediums: string[];
  searchTerm: string;
}

/**
 * Shop page data for products
 */
export interface ShopPageData {
  products: ArtworkProduct[];
  categories: string[];
}
