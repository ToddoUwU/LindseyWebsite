import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, forkJoin, Observable, of, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {Artwork, HomePageData} from '../models/api.model';
import {sanitizeInput, INPUT_LIMITS} from '../utils/security.utils';

// Mock data for development when backend is not available
const MOCK_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: 'Sunset Over Mountains',
    artDescription: 'A breathtaking view of golden sunlight cascading over mountain peaks, capturing the serene beauty of nature at dusk.',
    dimensions: '24" x 36"',
    smallImageUrl: 'https://picsum.photos/800/1200?random=1',
    mediumImageUrl: 'https://picsum.photos/1200/1800?random=1',
    largeImageUrl: 'https://picsum.photos/1600/2400?random=1',
    linkToPrint: 'https://printify.com/sunset-mountains',
    dateProduced: '2024-06-15',
    originalPrice: 1200,
    forSale: true,
    location: 'Studio',
    medium: 'Oil on Canvas',
    categories: 'Landscape,Nature',
    isFeatured: true
  },
  {
    id: 2,
    title: 'Ocean Dreams',
    artDescription: 'Waves crashing against rocks in a symphony of blues and whites, evoking the power and tranquility of the sea.',
    dimensions: '36" x 24"',
    smallImageUrl: 'https://picsum.photos/1200/800?random=2',
    mediumImageUrl: 'https://picsum.photos/1800/1200?random=2',
    largeImageUrl: 'https://picsum.photos/2400/1600?random=2',
    linkToPrint: '',
    dateProduced: '2024-03-20',
    originalPrice: 950,
    forSale: true,
    location: 'Gallery',
    medium: 'Acrylic on Canvas',
    categories: 'Seascape,Nature',
    isFeatured: true
  },
  {
    id: 3,
    title: 'Spring Blossoms',
    artDescription: 'Delicate cherry blossoms in full bloom, a celebration of renewal and the fleeting beauty of spring.',
    dimensions: '18" x 24"',
    smallImageUrl: 'https://picsum.photos/800/1000?random=3',
    mediumImageUrl: 'https://picsum.photos/1200/1500?random=3',
    largeImageUrl: 'https://picsum.photos/1600/2000?random=3',
    linkToPrint: '',
    dateProduced: '2023-04-10',
    originalPrice: 750,
    forSale: false,
    location: 'Private Collection',
    medium: 'Watercolor',
    categories: 'Floral,Nature',
    isFeatured: true
  },
  {
    id: 4,
    title: 'Abstract Harmony',
    artDescription: 'A vibrant exploration of color and form, blending geometric shapes with organic curves in perfect balance.',
    dimensions: '30" x 24"',
    smallImageUrl: 'https://picsum.photos/1000/800?random=4',
    mediumImageUrl: 'https://picsum.photos/1500/1200?random=4',
    largeImageUrl: 'https://picsum.photos/2000/1600?random=4',
    linkToPrint: 'https://printify.com/abstract-harmony',
    dateProduced: '2024-01-05',
    originalPrice: 1100,
    forSale: true,
    location: 'Studio',
    medium: 'Mixed Media',
    categories: 'Abstract,Modern',
    isFeatured: true
  },
  {
    id: 5,
    title: 'Forest Whispers',
    artDescription: 'Sunlight filtering through ancient trees, creating a mystical atmosphere in this enchanted woodland scene.',
    dimensions: '24" x 32"',
    smallImageUrl: 'https://picsum.photos/900/1200?random=5',
    mediumImageUrl: 'https://picsum.photos/1350/1800?random=5',
    largeImageUrl: 'https://picsum.photos/1800/2400?random=5',
    linkToPrint: '',
    dateProduced: '2023-09-12',
    originalPrice: 1350,
    forSale: true,
    location: 'Studio',
    medium: 'Oil on Canvas',
    categories: 'Landscape,Nature',
    isFeatured: false
  },
  {
    id: 6,
    title: 'City Lights',
    artDescription: 'The vibrant energy of urban nightlife captured in bold strokes and luminous colors.',
    dimensions: '48" x 28"',
    smallImageUrl: 'https://picsum.photos/1200/700?random=6',
    mediumImageUrl: 'https://picsum.photos/1800/1050?random=6',
    largeImageUrl: 'https://picsum.photos/2400/1400?random=6',
    linkToPrint: '',
    dateProduced: '2024-07-22',
    originalPrice: 1500,
    forSale: true,
    location: 'Gallery',
    medium: 'Acrylic on Canvas',
    categories: 'Urban,Modern',
    isFeatured: true
  },
  {
    id: 7,
    title: 'Serene Portrait',
    artDescription: 'A contemplative study of human emotion, rendered with sensitivity and grace.',
    dimensions: '16" x 22"',
    smallImageUrl: 'https://picsum.photos/800/1100?random=7',
    mediumImageUrl: 'https://picsum.photos/1200/1650?random=7',
    largeImageUrl: 'https://picsum.photos/1600/2200?random=7',
    linkToPrint: '',
    dateProduced: '2023-11-08',
    originalPrice: 600,
    forSale: false,
    location: 'Private Collection',
    medium: 'Charcoal on Paper',
    categories: 'Portrait,Figure',
    isFeatured: false
  },
  {
    id: 8,
    title: 'Autumn Reflections',
    artDescription: 'A peaceful lake mirroring the brilliant colors of fall foliage, a meditation on change and beauty.',
    dimensions: '36" x 24"',
    smallImageUrl: 'https://picsum.photos/1100/800?random=8',
    mediumImageUrl: 'https://picsum.photos/1650/1200?random=8',
    largeImageUrl: 'https://picsum.photos/2200/1600?random=8',
    linkToPrint: 'https://printify.com/autumn-reflections',
    dateProduced: '2024-10-01',
    originalPrice: 1250,
    forSale: true,
    location: 'Studio',
    medium: 'Oil on Canvas',
    categories: 'Landscape,Nature',
    isFeatured: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  // Signals for reactive state management
  homePageData = signal<HomePageData | null>(null);
  selectedArtwork = signal<Artwork | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get home page data: featured artworks + artworks for sale + categories + dimensions + mediums
   * Calls: GET /api/featured, GET /api/artworks/for-sale, GET /api/categories, GET /api/dimensions, GET /api/mediums
   */
  getHomePageData(): Observable<HomePageData> {
    this.loading.set(true);
    this.error.set(null);

    return forkJoin({
      featuredArtworks: this.http.get<Artwork[]>(`${this.apiUrl}/featured`),
      artworksForSale: this.http.get<Artwork[]>(`${this.apiUrl}/artworks/for-sale`),
      categories: this.http.get<string[]>(`${this.apiUrl}/categories`),
      dimensions: this.http.get<string[]>(`${this.apiUrl}/dimensions`),
      mediums: this.http.get<string[]>(`${this.apiUrl}/mediums`)
    }).pipe(
      tap(data => {
        this.homePageData.set(data);
        this.loading.set(false);
        console.log('✅ Loaded home page data:', data);
      }),
      catchError(error => {
        console.warn('⚠️ Backend not available, using mock data:', error.message);
        // Extract unique dimensions and mediums from mock data
        const uniqueDimensions = [...new Set(MOCK_ARTWORKS.map(a => a.dimensions).filter(Boolean))];
        const uniqueMediums = [...new Set(MOCK_ARTWORKS.map(a => a.medium).filter(Boolean))];

        const mockData: HomePageData = {
          featuredArtworks: MOCK_ARTWORKS.filter(a => a.isFeatured),
          artworksForSale: MOCK_ARTWORKS.filter(a => a.forSale),
          categories: ['Landscape', 'Nature', 'Seascape', 'Floral', 'Abstract', 'Modern', 'Urban', 'Portrait', 'Figure'],
          dimensions: uniqueDimensions,
          mediums: uniqueMediums
        };
        this.homePageData.set(mockData);
        this.loading.set(false);
        this.error.set(null);
        console.log('✅ Using mock data:', mockData);
        return of(mockData);
      })
    );
  }

  /**
   * Get featured artworks only
   * Calls: GET /api/featured
   */
  getFeaturedArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/featured`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock featured artworks');
        return of(MOCK_ARTWORKS.filter(a => a.isFeatured));
      })
    );
  }

  /**
   * Get artworks for sale
   * Calls: GET /api/artworks/for-sale
   */
  getArtworksForSale(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/artworks/for-sale`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock artworks for sale');
        return of(MOCK_ARTWORKS.filter(a => a.forSale));
      })
    );
  }

  /**
   * Get artworks by category
   * Calls: GET /api/artworks/category/{category}
   */
  getArtworksByCategory(category: string): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/artworks/category/${encodeURIComponent(category)}`).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock artworks for category:', category);
        return of(MOCK_ARTWORKS.filter(a => a.categories.toLowerCase().includes(category.toLowerCase())));
      })
    );
  }

  /**
   * Get full artwork details by ID
   * Calls: GET /api/artwork/{id}
   */
  getArtworkById(id: number): Observable<Artwork> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Artwork>(`${this.apiUrl}/artwork/${id}`).pipe(
      tap(artwork => {
        this.selectedArtwork.set(artwork);
        this.loading.set(false);
        console.log('✅ Loaded artwork:', artwork.title);
      }),
      catchError(error => {
        console.warn('⚠️ Backend not available, using mock artwork:', error.message);
        const mockArtwork = MOCK_ARTWORKS.find(a => a.id === id);
        if (mockArtwork) {
          this.selectedArtwork.set(mockArtwork);
          this.loading.set(false);
          console.log('✅ Using mock artwork:', mockArtwork.title);
          return of(mockArtwork);
        }
        this.error.set('Artwork not found.');
        this.loading.set(false);
        return of(null as any);
      })
    );
  }

  /**
   * Search artworks
   * Calls: GET /api/artworks/search?q={searchTerm}
   *
   * Security protections:
   * - Uses sanitizeInput utility for validation
   * - Trims whitespace, enforces max length, removes dangerous characters
   * - Returns empty array for invalid input
   */
  searchArtworks(searchTerm: string): Observable<Artwork[]> {
    // Use centralized security utility for validation
    const sanitized = sanitizeInput(searchTerm, INPUT_LIMITS.SEARCH);

    if (sanitized === null) {
      console.warn('Search rejected: invalid input');
      return of([]);
    }

    return this.http.get<Artwork[]>(`${this.apiUrl}/artworks/search`, {
      params: { q: sanitized }
    }).pipe(
      catchError(error => {
        console.warn('⚠️ Using mock search');
        const term = sanitized.toLowerCase();
        return of(MOCK_ARTWORKS.filter(a =>
          a.title.toLowerCase().includes(term) ||
          a.artDescription.toLowerCase().includes(term)
        ));
      })
    );
  }

  /**
   * Parse categories from comma-delimited string
   */
  parseCategories(artwork: Artwork): string[] {
    if (!artwork.categories) return [];
    return artwork.categories.split(',').map(cat => cat.trim());
  }

  /**
   * Filter artworks by category (client-side)
   */
  filterByCategory(artworks: Artwork[], category: string): Artwork[] {
    return artworks.filter(artwork =>
      this.parseCategories(artwork).includes(category)
    );
  }

  /**
   * Select an artwork to show in dialog
   */
  selectArtwork(artwork: Artwork): void {
    this.selectedArtwork.set(artwork);
  }

  /**
   * Clear selected artwork
   */
  clearSelection(): void {
    this.selectedArtwork.set(null);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error.set(null);
  }
}

