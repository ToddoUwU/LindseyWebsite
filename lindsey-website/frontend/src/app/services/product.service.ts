import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, forkJoin, Observable, of, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {ArtworkProduct, ShopPageData} from '../models/api.model';

// Mock data for development when backend is not available
const MOCK_PRODUCTS: ArtworkProduct[] = [
  // Prints
  {
    id: 1,
    artworkId: 1,
    artworkTitle: 'Sunset Over Mountains',
    artworkImageUrl: 'https://picsum.photos/600/800?random=101',
    description: '8x10 Art Print',
    productCategory: 'Print',
    productUrl: 'https://printify.com/app/products/sunset-mountains-print',
    price: 25,
    isAvailable: true,
    displayOrder: 1
  },
  {
    id: 2,
    artworkId: 1,
    artworkTitle: 'Sunset Over Mountains',
    artworkImageUrl: 'https://picsum.photos/600/800?random=101',
    description: '16x20 Canvas Print',
    productCategory: 'Canvas',
    productUrl: 'https://printify.com/app/products/sunset-mountains-canvas',
    price: 85,
    isAvailable: true,
    displayOrder: 2
  },
  {
    id: 3,
    artworkId: 2,
    artworkTitle: 'Ocean Dreams',
    artworkImageUrl: 'https://picsum.photos/800/600?random=102',
    description: '11x14 Art Print',
    productCategory: 'Print',
    productUrl: 'https://printify.com/app/products/ocean-dreams-print',
    price: 35,
    isAvailable: true,
    displayOrder: 1
  },
  // Merchandise
  {
    id: 4,
    artworkId: 1,
    artworkTitle: 'Sunset Over Mountains',
    description: 'Coffee Mug - 11oz',
    productCategory: 'Mug',
    productUrl: 'https://printify.com/app/products/sunset-mountains-mug',
    price: 18,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/600/600?random=108'
  },
  {
    id: 5,
    artworkId: 4,
    artworkTitle: 'Abstract Harmony',
    description: 'Unisex T-Shirt',
    productCategory: 'Apparel',
    productUrl: 'https://printify.com/app/products/abstract-harmony-tshirt',
    price: 32,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/600/700?random=104'
  },
  {
    id: 6,
    artworkId: 2,
    artworkTitle: 'Ocean Dreams',
    description: 'Tote Bag',
    productCategory: 'Accessories',
    productUrl: 'https://printify.com/app/products/ocean-dreams-tote',
    price: 28,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/600/600?random=107'
  },
  {
    id: 7,
    artworkId: 3,
    artworkTitle: 'Spring Blossoms',
    description: 'Throw Pillow - 18x18',
    productCategory: 'Home Decor',
    productUrl: 'https://printify.com/app/products/spring-blossoms-pillow',
    price: 35,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/600/600?random=109'
  },
  {
    id: 8,
    artworkId: 6,
    artworkTitle: 'City Lights',
    description: 'Phone Case',
    productCategory: 'Accessories',
    productUrl: 'https://printify.com/app/products/city-lights-phone-case',
    price: 25,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/500/700?random=106'
  },
  {
    id: 9,
    artworkId: 8,
    artworkTitle: 'Autumn Reflections',
    description: '24x36 Framed Print',
    productCategory: 'Print',
    productUrl: 'https://printify.com/app/products/autumn-reflections-framed',
    price: 120,
    isAvailable: true,
    displayOrder: 3
  },
  {
    id: 10,
    artworkId: 4,
    artworkTitle: 'Abstract Harmony',
    description: 'Shower Curtain',
    productCategory: 'Home Decor',
    productUrl: 'https://printify.com/app/products/abstract-harmony-curtain',
    price: 65,
    isAvailable: true,
    displayOrder: 10,
    productImageUrl: 'https://picsum.photos/600/800?random=110'
  }
];

const MOCK_CATEGORIES = ['Print', 'Canvas', 'Mug', 'Apparel', 'Accessories', 'Home Decor'];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Signals for reactive state management
  readonly shopPageData = signal<ShopPageData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedCategory = signal<string | null>(null);

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get shop page data: all available products + categories
   * Calls: GET /api/products, GET /api/products/categories
   */
  getShopPageData(): Observable<ShopPageData> {
    this.loading.set(true);
    this.error.set(null);

    return forkJoin({
      products: this.http.get<ArtworkProduct[]>(`${this.apiUrl}/products`),
      categories: this.http.get<string[]>(`${this.apiUrl}/products/categories`)
    }).pipe(
      tap(data => {
        this.shopPageData.set(data);
        this.loading.set(false);
        console.log('✅ Loaded shop page data:', data);
      }),
      catchError(error => {
        console.warn('⚠️ Backend not available, using mock data:', error.message);
        const mockData: ShopPageData = {
          products: MOCK_PRODUCTS.filter(p => p.isAvailable),
          categories: MOCK_CATEGORIES
        };
        this.shopPageData.set(mockData);
        this.loading.set(false);
        this.error.set(null);
        console.log('✅ Using mock data:', mockData);
        return of(mockData);
      })
    );
  }

  /**
   * Get products for a specific artwork
   * Calls: GET /api/products/artwork/{artworkId}
   */
  getProductsByArtworkId(artworkId: number): Observable<ArtworkProduct[]> {
    return this.http.get<ArtworkProduct[]>(`${this.apiUrl}/products/artwork/${artworkId}`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock products for artwork:', artworkId);
        return of(MOCK_PRODUCTS.filter(p => p.artworkId === artworkId && p.isAvailable));
      })
    );
  }

  /**
   * Get products by category
   * Calls: GET /api/products/category/{category}
   */
  getProductsByCategory(category: string): Observable<ArtworkProduct[]> {
    return this.http.get<ArtworkProduct[]>(`${this.apiUrl}/products/category/${encodeURIComponent(category)}`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock products for category:', category);
        return of(MOCK_PRODUCTS.filter(p =>
          p.productCategory.toLowerCase() === category.toLowerCase() && p.isAvailable
        ));
      })
    );
  }

  /**
   * Get all unique product categories
   * Calls: GET /api/products/categories
   */
  getProductCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock categories');
        return of(MOCK_CATEGORIES);
      })
    );
  }

  /**
   * Filter products by category (client-side)
   */
  filterByCategory(products: ArtworkProduct[], category: string | null): ArtworkProduct[] {
    if (!category) {
      return products;
    }
    return products.filter(p => p.productCategory.toLowerCase() === category.toLowerCase());
  }

  /**
   * Get display name for category (for UI)
   */
  getCategoryDisplayName(category: string): string {
    const displayNames: Record<string, string> = {
      'print': 'Prints',
      'canvas': 'Canvas Prints',
      'mug': 'Mugs',
      'apparel': 'Apparel',
      'accessories': 'Accessories',
      'home decor': 'Home Decor',
      'original': 'Originals'
    };
    return displayNames[category.toLowerCase()] || category;
  }

  /**
   * Get icon for category
   */
  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'print': 'image',
      'canvas': 'panorama',
      'mug': 'coffee',
      'apparel': 'checkroom',
      'accessories': 'shopping_bag',
      'home decor': 'home',
      'original': 'palette'
    };
    return icons[category.toLowerCase()] || 'category';
  }

  /**
   * Get image URL for product (falls back to artwork image)
   */
  getProductImageUrl(product: ArtworkProduct): string {
    return product.productImageUrl || product.artworkImageUrl || '';
  }

  /**
   * Set selected category filter
   */
  setSelectedCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error.set(null);
  }
}

