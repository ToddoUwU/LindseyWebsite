import {Injectable, signal, computed} from '@angular/core';
import {ArtworkFilters} from '../models/api.model';

/**
 * Service to manage filter panel state and active filters across components.
 * Allows the header to trigger opening the filter panel on the home page.
 */
@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // Signal to indicate if the filter panel should be open
  readonly isFilterPanelOpen = signal(false);

  // Active filters state
  readonly activeFilters = signal<ArtworkFilters>({ categories: [], dimensions: [], mediums: [], searchTerm: '' });

  // Computed: active filter count
  readonly activeFilterCount = computed(() => {
    const filters = this.activeFilters();
    return filters.categories.length + filters.dimensions.length + filters.mediums.length + (filters.searchTerm ? 1 : 0);
  });

  /**
   * Open the filter panel
   */
  openFilterPanel(): void {
    this.isFilterPanelOpen.set(true);
  }

  /**
   * Close the filter panel
   */
  closeFilterPanel(): void {
    this.isFilterPanelOpen.set(false);
  }

  /**
   * Toggle the filter panel
   */
  toggleFilterPanel(): void {
    this.isFilterPanelOpen.update(value => !value);
  }

  /**
   * Set active filters
   */
  setActiveFilters(filters: ArtworkFilters): void {
    this.activeFilters.set(filters);
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.activeFilters.set({ categories: [], dimensions: [], mediums: [], searchTerm: '' });
  }
}
