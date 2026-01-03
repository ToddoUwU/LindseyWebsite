import {Component, effect, HostListener, inject, signal, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ArtworkService} from '../../services/artwork.service';
import {ProductService} from '../../services/product.service';
import {ArtworkProduct} from '../../models/api.model';
import {environment} from '../../../environments/environment';
import {InquiryDialogComponent} from '../inquiry-dialog/inquiry-dialog';

@Component({
  selector: 'app-artwork-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgOptimizedImage, InquiryDialogComponent],
  templateUrl: './artwork-dialog.component.html',
  styleUrl: './artwork-dialog.component.scss'
})
export class ArtworkDialogComponent {
  readonly isClosing = signal(false);
  readonly artworkProducts = signal<ArtworkProduct[]>([]);
  readonly loadingProducts = signal(false);
  readonly showFullSize = signal(false);

  @ViewChild(InquiryDialogComponent) inquiryDialog!: InquiryDialogComponent;

  private artworkService = inject(ArtworkService);
  private productService = inject(ProductService);
  readonly artwork = this.artworkService.selectedArtwork;

  constructor() {
    // Load products when artwork changes
    effect(() => {
      const artwork = this.artwork();
      if (artwork) {
        this.loadProducts(artwork.id);
        this.showFullSize.set(false); // Reset to medium when artwork changes
      } else {
        this.artworkProducts.set([]);
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showFullSize()) {
      this.showFullSize.set(false);
    } else {
      this.close();
    }
  }

  close(): void {
    this.isClosing.set(true);
    setTimeout(() => {
      this.artworkService.clearSelection();
      this.isClosing.set(false);
      this.showFullSize.set(false);
    }, 200);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      if (this.showFullSize()) {
        this.showFullSize.set(false);
      } else {
        this.close();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.showFullSize()) {
        this.showFullSize.set(false);
      } else {
        this.close();
      }
    }
  }

  /**
   * Toggle full-size image view
   */
  toggleFullSize(): void {
    this.showFullSize.set(!this.showFullSize());
  }

  /**
   * Open full-size image in new tab
   */
  openFullSizeInNewTab(): void {
    const url = this.getLargeImageUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Load products for the current artwork
   */
  private loadProducts(artworkId: number): void {
    this.loadingProducts.set(true);
    this.productService.getProductsByArtworkId(artworkId).subscribe({
      next: (products) => {
        this.artworkProducts.set(products);
        this.loadingProducts.set(false);
      },
      error: () => {
        this.artworkProducts.set([]);
        this.loadingProducts.set(false);
      }
    });
  }

  /**
   * Open product URL
   */
  openProduct(product: ArtworkProduct): void {
    window.open(product.productUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Get medium image URL (default for dialog)
   */
  getMediumImageUrl(): string {
    const artwork = this.artwork();
    if (!artwork) return '';
    const url = artwork.mediumImageUrl;
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    return `${environment.imageBaseUrl}${url}`;
  }

  /**
   * Get medium image dimensions (width, height)
   */
  getMediumImageWidth(): number | null {
    const artwork = this.artwork();
    return artwork?.mediumImageWidth ?? null;
  }
  getMediumImageHeight(): number | null {
    const artwork = this.artwork();
    return artwork?.mediumImageHeight ?? null;
  }

  /**
   * Get large/full-size image URL
   */
  getLargeImageUrl(): string {
    const artwork = this.artwork();
    if (!artwork) return '';
    const url = artwork.largeImageUrl;
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    return `${environment.imageBaseUrl}${url}`;
  }

  /**
   * Get large image dimensions (width, height)
   */
  getLargeImageWidth(): number | null {
    const artwork = this.artwork();
    return artwork?.largeImageWidth ?? null;
  }
  getLargeImageHeight(): number | null {
    const artwork = this.artwork();
    return artwork?.largeImageHeight ?? null;
  }

  /**
   * Get current image URL based on view mode
   */
  getCurrentImageUrl(): string {
    return this.showFullSize() ? this.getLargeImageUrl() : this.getMediumImageUrl();
  }

  /**
   * Parse categories from comma-delimited string
   */
  getCategories(): string[] {
    const artwork = this.artwork();
    if (!artwork?.categories) return [];
    return artwork.categories.split(',').map(cat => cat.trim());
  }

  /**
   * Get year from dateProduced
   */
  getYear(): number | null {
    const artwork = this.artwork();
    if (!artwork?.dateProduced) return null;
    return new Date(artwork.dateProduced).getFullYear();
  }

  /**
   * Get icon for product category
   */
  getProductIcon(category: string): string {
    return this.productService.getCategoryIcon(category);
  }

  /**
   * Show inquiry dialog for original artwork
   */
  showInquiryDialog(): void {
    if (this.inquiryDialog) {
      this.inquiryDialog.show();
    }
  }
}
