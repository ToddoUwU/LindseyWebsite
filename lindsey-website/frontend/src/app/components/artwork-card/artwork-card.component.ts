import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Artwork } from '../../models/api.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatIconModule],
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.scss'
})
export class ArtworkCardComponent {
  // Artwork is a plain object passed from parent (HomeComponent)
  @Input() artwork!: Artwork;
  @Output() artworkSelected = new EventEmitter<Artwork>();

  imageLoaded = false;

  // Note: artwork is required; methods guard against undefined at runtime

  // Small-image helpers (card only needs these)
  getSmallImageUrl(): string {
    const art = this.artwork;
    const url = art?.smallImageUrl || '';
    if (!url) return `${environment.imageBaseUrl}/assets/placeholder.jpg`;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${environment.imageBaseUrl}${url}`;
  }

  getSmallImageWidth(): number | null {
    return this.artwork?.smallImageWidth ?? null;
  }

  getSmallImageHeight(): number | null {
    return this.artwork?.smallImageHeight ?? null;
  }

  // Events
  onCardClick(): void {
    if (this.artwork) this.artworkSelected.emit(this.artwork);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.artwork) this.artworkSelected.emit(this.artwork);
    }
  }

  onImageLoad(_: Event): void {
    this.imageLoaded = true;
  }
}
