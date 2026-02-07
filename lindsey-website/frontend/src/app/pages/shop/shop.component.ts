import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ProductCardComponent} from '../../components/product-card/product-card.component';
import {ArtworkProduct} from '../../models/api.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  readonly shopPageData = this.productService.shopPageData;
  readonly loading = this.productService.loading;
  readonly error = this.productService.error;
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedArtworkId = signal<number | null>(null);

  readonly filteredProducts = computed(() => {
    let products = this.shopPageData()?.products ?? [];
    const artworkId = this.selectedArtworkId();
    if (artworkId !== null) {
      products = products.filter(p => p.artworkId === artworkId);
    }
    return this.productService.filterByCategory(products, this.selectedCategory());
  });

  // Dynamic categories from API
  readonly categories = computed(() => {
    const cats = this.shopPageData()?.categories ?? [];
    return [
      { key: null, label: 'All Products', icon: 'apps' },
      ...cats.map(cat => ({
        key: cat,
        label: this.productService.getCategoryDisplayName(cat),
        icon: this.productService.getCategoryIcon(cat)
      }))
    ];
  });

  // External Printify storefront URL - update with Lindsey's actual store URL
  readonly printifyStoreUrl = 'https://printify.com/store/lindseys-art';

  ngOnInit(): void {
    this.productService.getShopPageData().subscribe();

    // Subscribe to query parameters for initial category filter
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      const artworkId = params['artworkId'];
      if (category) {
        this.selectedCategory.set(category);
      }
      if (artworkId) {
        this.selectedArtworkId.set(+artworkId);
      }
    });
  }

  onCategorySelect(category: string | null): void {
    this.selectedCategory.set(category);
  }

  onProductView(product: ArtworkProduct): void {
    // Could open a modal preview here in the future
    window.open(product.productUrl, '_blank', 'noopener,noreferrer');
  }

  openPrintifyStore(): void {
    window.open(this.printifyStoreUrl, '_blank', 'noopener,noreferrer');
  }

  getCategoryCount(category: string | null): number {
    const products = this.shopPageData()?.products ?? [];
    if (!category) return products.length;
    return products.filter(p => p.productCategory.toLowerCase() === category.toLowerCase()).length;
  }
}
