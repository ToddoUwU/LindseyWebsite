import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ArtworkService} from '../../services/artwork.service';
import {ArtworkCardComponent} from '../../components/artwork-card/artwork-card.component';
import {ArtworkDialogComponent} from '../../components/artwork-dialog/artwork-dialog.component';
import {ArtworkFilterComponent} from '../../components/artwork-filter/artwork-filter.component';
import {Artwork, ArtworkFilters} from '../../models/api.model';
import {environment} from '../../../environments/environment';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ArtworkCardComponent,
    ArtworkDialogComponent,
    ArtworkFilterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private artworkService = inject(ArtworkService);
  private filterService = inject(FilterService);

  readonly homePageData = this.artworkService.homePageData;
  readonly loading = this.artworkService.loading;
  readonly error = this.artworkService.error;

  // Featured slider state
  readonly currentSlideIndex = signal(0);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  // Filter state from service
  readonly activeFilters = this.filterService.activeFilters;
  readonly activeFilterEnabled = computed(
    () => this.filterService.activeFilterCount() > 0
  );
  // Computed: featured artworks for slider
  readonly featuredArtworks = computed(() =>
    this.homePageData()?.featuredArtworks ?? []
  );


  // Computed: filtered artworks for sale
  readonly filteredArtworksForSale = computed(() => {
    const artworks = this.homePageData()?.artworksForSale ?? [];
    const filters = this.activeFilters();

    return artworks.filter(artwork => {
      // Filter by search term (title)
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        if (!artwork.title.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filter by categories
      if (filters.categories.length > 0) {
        const artworkCategories = this.artworkService.parseCategories(artwork);
        const hasMatchingCategory = filters.categories.some(cat =>
          artworkCategories.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      // Filter by dimensions
      if (filters.dimensions.length > 0) {
        if (!filters.dimensions.includes(artwork.dimensions)) return false;
      }

      // Filter by mediums
      if (filters.mediums.length > 0) {
        if (!filters.mediums.includes(artwork.medium)) return false;
      }

      return true;
    });
  });

  // Computed: available categories
  readonly categories = computed(() =>
    this.homePageData()?.categories ?? []
  );

  // Computed: available dimensions
  readonly dimensions = computed(() =>
    this.homePageData()?.dimensions ?? []
  );

  // Computed: available mediums
  readonly mediums = computed(() =>
    this.homePageData()?.mediums ?? []
  );

  ngOnInit(): void {
    // Load home page data from API
    this.artworkService.getHomePageData().subscribe(() => {
      // Start auto-slide after data loads
      this.startAutoSlide();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // ==================== Featured Slider Methods ====================

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide(): void {
    const total = this.featuredArtworks().length;
    if (total === 0) return;
    this.currentSlideIndex.set((this.currentSlideIndex() + 1) % total);
  }

  prevSlide(): void {
    const total = this.featuredArtworks().length;
    if (total === 0) return;
    this.currentSlideIndex.set((this.currentSlideIndex() - 1 + total) % total);
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    // Reset auto-slide timer when manually navigating
    this.startAutoSlide();
  }

  onSliderMouseEnter(): void {
    this.stopAutoSlide();
  }

  onSliderMouseLeave(): void {
    this.startAutoSlide();
  }

  // ==================== Carousel Helper Methods ====================

  isPrevSlide(index: number): boolean {
    const total = this.featuredArtworks().length;
    if (total <= 1) return false;
    const current = this.currentSlideIndex();
    return index === (current - 1 + total) % total;
  }

  isNextSlide(index: number): boolean {
    const total = this.featuredArtworks().length;
    if (total <= 1) return false;
    const current = this.currentSlideIndex();
    return index === (current + 1) % total;
  }

  isVisibleSlide(index: number): boolean {
    return this.currentSlideIndex() === index || this.isPrevSlide(index) || this.isNextSlide(index);
  }

  onCarouselItemClick(index: number, artwork: Artwork): void {
    if (this.currentSlideIndex() === index) {
      // Click on active slide opens the dialog
      this.artworkService.selectArtwork(artwork);
    } else {
      // Click on side slide navigates to it
      this.goToSlide(index);
    }
  }

  // ==================== Artwork Selection ====================


  onArtworkSelected(artwork: Artwork): void {
    this.artworkService.selectArtwork(artwork);
  }

  // ==================== Filter Methods ====================

  onFiltersChanged(filters: ArtworkFilters): void {
    this.filterService.setActiveFilters(filters);
  }

  clearAllFilters(): void {
    this.filterService.clearAllFilters();
  }

  // ==================== Utility Methods ====================

  getSmallImageUrl(artwork: Artwork): string {
    const url = artwork.smallImageUrl;
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    return `${environment.imageBaseUrl}${url}`;
  }


  getActiveFilterSummary(): string {
    const filters = this.activeFilters();
    const parts: string[] = [];

    if (filters.categories.length > 0) {
      parts.push(filters.categories.length === 1
        ? filters.categories[0]
        : `${filters.categories.length} categories`);
    }
    if (filters.dimensions.length > 0) {
      parts.push(filters.dimensions.length === 1
        ? filters.dimensions[0]
        : `${filters.dimensions.length} sizes`);
    }
    if (filters.mediums.length > 0) {
      parts.push(filters.mediums.length === 1
        ? filters.mediums[0]
        : `${filters.mediums.length} mediums`);
    }

    return parts.join(', ');
  }
}
