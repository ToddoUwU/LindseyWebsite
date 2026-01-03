import {Component, ElementRef, HostListener, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly isMenuOpen = signal(false);
  private elementRef = inject(ElementRef);
  private filterService = inject(FilterService);
  private router = inject(Router);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menu = this.elementRef.nativeElement.querySelector('.menu-dropdown');
    const menuButton = this.elementRef.nativeElement.querySelector('.menu-button');

    if (this.isMenuOpen() && menu && !menu.contains(target) && !menuButton.contains(target)) {
      this.isMenuOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  openFilter(): void {
    // Navigate to home page first if not already there
    if (!this.router.url.startsWith('/') || this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        // Small delay to ensure home component is ready
        setTimeout(() => {
          this.filterService.openFilterPanel();
        }, 100);
      });
    } else {
      this.filterService.openFilterPanel();
    }
    this.isMenuOpen.set(false);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
