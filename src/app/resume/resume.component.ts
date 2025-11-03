import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent {
  // Resume tabs: show one panel and mark active tab
  toggleContent(tab: 'education' | 'experience') {
    // Diagnostics: log requested tab — helpful when debugging clicks
    console.debug('[Resume] toggleContent called with:', tab);

    const education = document.getElementById('education');
    const experience = document.getElementById('experience');
    const expTab = document.getElementById('tabExperience');
    const eduTab = document.getElementById('tabEducation');

    if (!education) {
      console.warn('[Resume] education element not found');
    }
    if (!experience) {
      console.warn('[Resume] experience element not found');
    }

    // Toggle visibility using inline styles (keeps existing CSS behavior)
    try {
      if (education && experience) {
        if (tab === 'education') {
          education.style.display = 'block';
          experience.style.display = 'none';
          // scroll to the panel but offset for the fixed navbar so the panel isn't hidden
          setTimeout(() => {
            const navbar = document.querySelector('.navbar.fixed-top') as HTMLElement | null;
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
            const top = education.getBoundingClientRect().top + window.scrollY - navbarHeight - 150;
            window.scrollTo({ top, behavior: 'smooth' });
          }, 50);
        } else {
          education.style.display = 'none';
          experience.style.display = 'block';
          setTimeout(() => {
            const navbar = document.querySelector('.navbar.fixed-top') as HTMLElement | null;
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
            const top = experience.getBoundingClientRect().top + window.scrollY - navbarHeight - 150;
            window.scrollTo({ top, behavior: 'smooth' });
          }, 50);
        }
      }
    } catch (err) {
      console.error('[Resume] error toggling panels', err);
    }

    if (expTab && eduTab) {
      expTab.classList.toggle('active', tab === 'experience');
      eduTab.classList.toggle('active', tab === 'education');
      // update ARIA selection for accessibility
      try {
        expTab.setAttribute('aria-selected', tab === 'experience' ? 'true' : 'false');
        eduTab.setAttribute('aria-selected', tab === 'education' ? 'true' : 'false');
      } catch (e) {
        console.warn('[Resume] could not set aria-selected on tabs', e);
      }
    }
  }
}
