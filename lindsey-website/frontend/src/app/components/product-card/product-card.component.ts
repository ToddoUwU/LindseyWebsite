import {Component, inject, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtworkProduct} from '../../models/api.model';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private productService = inject(ProductService);

  product = input.required<ArtworkProduct>();
  viewProduct = output<ArtworkProduct>();

  // Keep a loaded flag for the skeleton
  imageLoaded = false;

  onViewClick(event: Event): void {
    event.stopPropagation();
    // Open product URL in new tab
    window.open(this.product().productUrl, '_blank', 'noopener,noreferrer');
  }

  onCardClick(): void {
    this.viewProduct.emit(this.product());
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onViewClick(event);
    }
  }

  getImageUrl(): string {
    return this.productService.getProductImageUrl(this.product());
  }

  getCategoryIcon(): string {
    return this.productService.getCategoryIcon(this.product().productCategory);
  }

  // Only mark loaded; do not change width/height attributes after init
  onImageLoad(_: Event): void {
    this.imageLoaded = true;
  }
}
