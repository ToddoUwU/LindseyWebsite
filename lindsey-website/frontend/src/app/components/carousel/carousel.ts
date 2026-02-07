import {Component, computed, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ArtworkService} from '../../services/artwork.service';
import {Artwork} from '../../models/api.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, NgOptimizedImage, MatButtonModule, MatIconModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit, OnDestroy {
  private artworkService = inject(ArtworkService);

  // Input for featured artworks
  featuredArtworks = input<Artwork[]>([]);

  // Featured slider state
  readonly currentSlideIndex = signal(0);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Start auto-slide after component initializes
    this.startAutoSlide();
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

  // ==================== Utility Methods ====================

  getSmallImageUrl(artwork: Artwork): string {
    const url = artwork.smallImageUrl;
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    return `${environment.imageBaseUrl}${url}`;
  }
}
