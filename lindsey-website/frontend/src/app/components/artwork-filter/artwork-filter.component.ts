import {Component, computed, effect, HostListener, inject, input, OnDestroy, OnInit, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ArtworkFilters} from '../../models/api.model';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-artwork-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatBadgeModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './artwork-filter.component.html',
  styleUrl: './artwork-filter.component.scss'
})
export class ArtworkFilterComponent implements OnInit, OnDestroy {
  // Available options
  categories = input.required<string[]>();
  dimensions = input.required<string[]>();
  mediums = input.required<string[]>();

  // Current active filters from parent
  activeFilters = input<ArtworkFilters>({ categories: [], dimensions: [], mediums: [], searchTerm: '' });

  // Events
  filtersChanged = output<ArtworkFilters>();
  filtersClosed = output<void>();

  // Services
  private filterService = inject(FilterService);

  // UI State
  readonly isOpen = signal(false);
  readonly isMobile = signal(false);

  // Local filter state (for mobile apply/cancel)
  readonly pendingFilters = signal<ArtworkFilters>({ categories: [], dimensions: [], mediums: [], searchTerm: '' });

  // Count of active filters (including search)
  readonly activeFilterCount = computed(() => {
    const filters = this.activeFilters();
    return filters.categories.length + filters.dimensions.length + filters.mediums.length + (filters.searchTerm ? 1 : 0);
  });

  constructor() {
    // Check for mobile on init and resize
    this.checkMobile();

    // Sync pending filters with active filters when opening
    effect(() => {
      if (this.isOpen()) {
        this.pendingFilters.set({ ...this.activeFilters() });
      }
    });

    // Listen to filter service for external open requests
    effect(() => {
      if (this.filterService.isFilterPanelOpen()) {
        this.open();
        // Reset the service state
        this.filterService.closeFilterPanel();
      }
    });
  }

  ngOnInit(): void {
    this.checkMobile();
  }

  ngOnDestroy(): void {
    // Clean up body overflow if component is destroyed while open
    document.body.style.overflow = '';
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  // ==================== Panel Control ====================

  open(): void {
    this.isOpen.set(true);
    this.pendingFilters.set({ ...this.activeFilters() });
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
    this.filtersClosed.emit();
  }

  onBackdropClick(): void {
    // Always close on backdrop click
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  // ==================== Search ====================

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.isMobile()) {
      this.pendingFilters.update(f => ({ ...f, searchTerm: value }));
    } else {
      this.filtersChanged.emit({ ...this.activeFilters(), searchTerm: value });
    }
  }

  clearSearch(): void {
    if (this.isMobile()) {
      this.pendingFilters.update(f => ({ ...f, searchTerm: '' }));
    } else {
      this.filtersChanged.emit({ ...this.activeFilters(), searchTerm: '' });
    }
  }

  getSearchTerm(): string {
    return this.isMobile() ? this.pendingFilters().searchTerm : this.activeFilters().searchTerm;
  }

  getPendingSearchTerm(): string {
    return this.pendingFilters().searchTerm;
  }

  // ==================== Filter Selection ====================

  toggleCategory(category: string): void {
    const filters = this.isMobile() ? { ...this.pendingFilters() } : { ...this.activeFilters() };
    const index = filters.categories.indexOf(category);

    if (index === -1) {
      filters.categories = [...filters.categories, category];
    } else {
      filters.categories = filters.categories.filter((c: string) => c !== category);
    }

    if (this.isMobile()) {
      this.pendingFilters.set(filters);
    } else {
      this.filtersChanged.emit(filters);
    }
  }

  toggleDimension(dimension: string): void {
    const filters = this.isMobile() ? { ...this.pendingFilters() } : { ...this.activeFilters() };
    const index = filters.dimensions.indexOf(dimension);

    if (index === -1) {
      filters.dimensions = [...filters.dimensions, dimension];
    } else {
      filters.dimensions = filters.dimensions.filter((d: string) => d !== dimension);
    }

    if (this.isMobile()) {
      this.pendingFilters.set(filters);
    } else {
      this.filtersChanged.emit(filters);
    }
  }

  toggleMedium(medium: string): void {
    const filters = this.isMobile() ? { ...this.pendingFilters() } : { ...this.activeFilters() };
    const index = filters.mediums.indexOf(medium);

    if (index === -1) {
      filters.mediums = [...filters.mediums, medium];
    } else {
      filters.mediums = filters.mediums.filter((m: string) => m !== medium);
    }

    if (this.isMobile()) {
      this.pendingFilters.set(filters);
    } else {
      this.filtersChanged.emit(filters);
    }
  }

  // ==================== Check Selection State ====================

  isCategorySelected(category: string): boolean {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.categories.includes(category);
  }

  isDimensionSelected(dimension: string): boolean {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.dimensions.includes(dimension);
  }

  isMediumSelected(medium: string): boolean {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.mediums.includes(medium);
  }

  // ==================== Mobile Actions ====================

  applyFilters(): void {
    this.filtersChanged.emit(this.pendingFilters());
    this.close();
  }

  cancelFilters(): void {
    this.pendingFilters.set({ ...this.activeFilters() });
    this.close();
  }

  clearAllFilters(): void {
    const emptyFilters: ArtworkFilters = { categories: [], dimensions: [], mediums: [], searchTerm: '' };
    if (this.isMobile()) {
      this.pendingFilters.set(emptyFilters);
    } else {
      this.filtersChanged.emit(emptyFilters);
    }
  }

  // ==================== Counts ====================

  getPendingFilterCount(): number {
    const filters = this.pendingFilters();
    return filters.categories.length + filters.dimensions.length + filters.mediums.length;
  }

  getTotalPendingCount(): number {
    return this.getPendingFilterCount() + (this.getPendingSearchTerm() ? 1 : 0);
  }

  getCategoryCount(): number {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.categories.length;
  }

  getDimensionCount(): number {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.dimensions.length;
  }

  getMediumCount(): number {
    const filters = this.isMobile() ? this.pendingFilters() : this.activeFilters();
    return filters.mediums.length;
  }
}
