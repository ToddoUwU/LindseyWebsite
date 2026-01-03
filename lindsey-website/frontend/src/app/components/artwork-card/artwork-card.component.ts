import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {Artwork} from '../../models/api.model';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.scss'
})
export class ArtworkCardComponent {
  artwork = input.required<Artwork>();
  artworkSelected = output<Artwork>();

  // default/fallback sizes removed from attrs; keep loaded flag for skeleton
  imageLoaded = false;

  getImageUrl(): string {
    const url = this.artwork().smallImageUrl;
    // If URL is already absolute, return as-is; otherwise prepend base URL
    if (url?.startsWith('http://') || url?.startsWith('https://')) {
      return url;
    }
    return `${environment.imageBaseUrl}${url}`;
  }

  onCardClick(): void {
    this.artworkSelected.emit(this.artwork());
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.artworkSelected.emit(this.artwork());
    }
  }

  onImageLoad(_: Event): void {
    this.imageLoaded = true;
  }
}
