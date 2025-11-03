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

  // Contact form submit: posts to Web3Forms or Formspree
  // Works on static hosting (e.g., GitHub Pages)
  async onSubmitContact(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;
    const fd = new FormData(form);

    // Quick required checks (HTML has required too)
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const subject = (fd.get('subject') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();
    if (!name || !email || !subject || !message) {
      this.submitSuccess = false;
      return;
    }

    this.isSending = true;
    this.submitSuccess = null;
    try {
      let ok = false;
      if (this.contactProvider === 'web3forms' && this.web3formsAccessKey) {
        fd.append('access_key', this.web3formsAccessKey);
        fd.append('from_name', name);
        fd.append('replyto', email);
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        ok = !!data?.success;
      } else if (this.contactProvider === 'formspree' && this.formspreeEndpoint) {
        const res = await fetch(this.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: fd
        });
        ok = res.ok;
      } else {
        console.warn('Contact form provider not configured. Please set web3formsAccessKey or formspreeEndpoint.');
        ok = false;
      }

      this.submitSuccess = ok;
      if (ok) form.reset();
    } catch (err) {
      console.error('Contact form submission error:', err);
      this.submitSuccess = false;
    } finally {
      this.isSending = false;
    }
  }
}
