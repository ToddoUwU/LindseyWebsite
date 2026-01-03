import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly formData = signal({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal(false);

  updateField(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.submitSuccess.set(true);
      this.formData.set({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      this.submitError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
