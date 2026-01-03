import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatIconRegistry} from '@angular/material/icon';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lindsey-website';
  private iconRegistry = inject(MatIconRegistry);

  constructor() {
    // Register Material Symbols Rounded as the default font set
    // The font is loaded via @fontsource-variable/material-symbols-rounded in angular.json
    this.iconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }
}
