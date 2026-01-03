import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ArtworkService} from '../../services/artwork.service';
import {ContactService, InquiryRequest} from '../../services/contact.service';

@Component({
  selector: 'app-inquiry-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './inquiry-dialog.html',
  styleUrl: './inquiry-dialog.scss'
})
export class InquiryDialogComponent {
  readonly isVisible = signal(false);
  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal(false);

  readonly formData = signal({
    name: '',
    email: '',
    message: ''
  });

  public artworkService = inject(ArtworkService);
  private contactService = inject(ContactService);

  show(): void {
    const artwork = this.artworkService.selectedArtwork();
    if (artwork) {
      this.isVisible.set(true);
      this.submitSuccess.set(false);
      this.submitError.set(false);
    }
  }

  hide(): void {
    this.isVisible.set(false);
    this.formData.set({ name: '', email: '', message: '' });
  }

  updateField(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('inquiry-backdrop')) {
      this.hide();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const artwork = this.artworkService.selectedArtwork();
    if (!artwork) return;

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    const request: InquiryRequest = {
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      artworkDimensions: artwork.dimensions,
      name: this.formData().name,
      email: this.formData().email,
      message: this.formData().message
    };

    this.contactService.submitInquiry(request).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.isSubmitting.set(false);
        setTimeout(() => this.hide(), 2000);
      },
      error: (error) => {
        console.error('Inquiry submission failed:', error);
        this.submitError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}
