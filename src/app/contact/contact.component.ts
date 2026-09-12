import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  @Input() currentYear!: number;
  @Input() web3formsAccessKey!: string;
  @Input() formspreeEndpoint!: string;
  @Input() contactProvider!: 'web3forms' | 'formspree';

  // UI state
  isSending = false;
  submitSuccess: boolean | null = null;
  fieldErrors: Record<string, string> = {};

  // Contact form submit: posts to Web3Forms or Formspree
  // Works on static hosting (e.g., GitHub Pages)
  async onSubmitContact(e: Event): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);
    const fields = this.readFormFields(formData);
    this.fieldErrors = this.validateFields(fields);
    if (Object.keys(this.fieldErrors).length) {
      this.submitSuccess = false;
      return;
    }

    this.isSending = true;
    this.submitSuccess = null;
    try {
      this.submitSuccess = await this.submitForm(formData, fields);
      if (this.submitSuccess) {
        form.reset();
        this.fieldErrors = {};
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      this.submitSuccess = false;
    } finally {
      this.isSending = false;
    }
  }

  private readFormFields(formData: FormData): Record<string, string> {
    return ['name', 'email', 'subject', 'message'].reduce((fields, field) => {
      fields[field] = (formData.get(field) || '').toString().trim();
      return fields;
    }, {} as Record<string, string>);
  }

  private validateFields(fields: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!fields.name) errors.name = 'Please enter your name.';
    if (!fields.email) errors.email = 'Please enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(fields.email)) errors.email = 'Please enter a valid email address.';
    if (!fields.subject) errors.subject = 'Please enter a subject.';
    if (!fields.message) errors.message = 'Please enter a message.';
    return errors;
  }

  private async submitForm(formData: FormData, fields: Record<string, string>): Promise<boolean> {
    if (this.contactProvider === 'web3forms' && this.web3formsAccessKey) {
      formData.append('access_key', this.web3formsAccessKey);
      formData.append('from_name', fields.name);
      formData.append('replyto', fields.email);
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await response.json().catch(() => ({}));
      return !!data?.success;
    }
    if (this.contactProvider === 'formspree' && this.formspreeEndpoint) {
      const response = await fetch(this.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      return response.ok;
    }
    console.warn('Contact form provider not configured. Please set web3formsAccessKey or formspreeEndpoint.');
    return false;
  }
}
