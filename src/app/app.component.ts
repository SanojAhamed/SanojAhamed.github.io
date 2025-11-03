import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { SkillsComponent } from './skills/skills.component';
import { ResumeComponent } from './resume/resume.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    SkillsComponent,
    ResumeComponent,
    PortfolioComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'portfolio';
  currentYear = new Date().getFullYear();

  // Contact delivery provider (static‑site friendly)
  contactProvider: 'web3forms' | 'formspree' = 'web3forms';
  web3formsAccessKey = '95cf02e4-7cc2-4571-9ea6-99ed0de535b1';
  formspreeEndpoint = '';

  ngAfterViewInit(): void {
    // Navbar: add dark bg + shadow after scrolling, and when mobile toggler opens
    const nav = document.querySelector('nav');
    const navbarToggle = document.querySelector('.navbar-toggler') as HTMLElement | null;

    const addBgDarkToNavbar = () => {
      (nav as HTMLElement | null)?.classList.add('bg-dark');
    };

    const removeBgDarkFromNavbar = () => {
      (nav as HTMLElement | null)?.classList.remove('bg-dark');
    };

    const handleNavbarScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 100) {
        (nav as HTMLElement | null)?.classList.add('shadow');
        addBgDarkToNavbar();
      } else {
        (nav as HTMLElement | null)?.classList.remove('shadow');
        removeBgDarkFromNavbar();
      }
    };

    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);

    if (navbarToggle) {
      navbarToggle.addEventListener('click', () => {
        if (!(nav as HTMLElement).classList.contains('bg-dark')) {
          addBgDarkToNavbar();
        } else {
          removeBgDarkFromNavbar();
        }
      });
    }

    // close mobile navbar when clicking/touching outside the nav area
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement | null;
    const outsideClickHandler = (ev: MouseEvent | TouchEvent) => {
      const target = ev.target as Node | null;
      if (!navbarCollapse || !navbarCollapse.classList.contains('show')) return;
      // clicked inside nav or on the toggler -> ignore
      if (nav && target && nav.contains(target)) return;
      if (navbarToggle && target && navbarToggle.contains(target)) return;
      // close via toggler if present so Bootstrap handlers run
      if (navbarToggle) {
        (navbarToggle as HTMLElement).click();
      } else {
        navbarCollapse.classList.remove('show');
        if (navbarToggle) navbarToggle.classList.add('collapsed');
        removeBgDarkFromNavbar();
      }
    };

    document.addEventListener('click', outsideClickHandler);
    document.addEventListener('touchstart', outsideClickHandler);

    // Skills/Tools section: toggle which list is visible and update button styles
    const toggleBtnBox = document.querySelector('[data-toggle-box]') as HTMLElement | null;
    const toggleBtns = document.querySelectorAll('[data-toggle-btn]');
    const skillsBox = document.querySelector('[data-skills-box]') as HTMLElement | null;
    const skillsBtn = document.getElementById('skillsTabBtn') as HTMLElement | null;
    const toolsBtn = document.getElementById('toolsTabBtn') as HTMLElement | null;

    const setSkillsView = (view: 'skills' | 'tools') => {
      if (!skillsBox || !toggleBtnBox || !skillsBtn || !toolsBtn) return;

      skillsBox.classList.toggle('active', view === 'tools');
      toggleBtnBox.classList.toggle('active', view === 'tools');

      skillsBtn.classList.toggle('active', view === 'skills');
      toolsBtn.classList.toggle('active', view === 'tools');

      const toSkills = () => {
        skillsBtn.classList.add('bg-red-600', 'text-white');
        skillsBtn.classList.remove('bg-gray-200', 'text-gray-700');
        toolsBtn.classList.add('bg-gray-200', 'text-gray-700');
        toolsBtn.classList.remove('bg-red-600', 'text-white');
        skillsBtn.setAttribute('aria-pressed', 'true');
        toolsBtn.setAttribute('aria-pressed', 'false');
      };
      const toTools = () => {
        toolsBtn.classList.add('bg-red-600', 'text-white');
        toolsBtn.classList.remove('bg-gray-200', 'text-gray-700');
        skillsBtn.classList.add('bg-gray-200', 'text-gray-700');
        skillsBtn.classList.remove('bg-red-600', 'text-white');
        skillsBtn.setAttribute('aria-pressed', 'false');
        toolsBtn.setAttribute('aria-pressed', 'true');
      };
      if (view === 'skills') toSkills(); else toTools();
    };

    toggleBtns.forEach((btn) => btn.addEventListener('click', (e) => {
      const label = (e.currentTarget as HTMLElement).textContent?.trim().toLowerCase();
      setSkillsView(label === 'tools' ? 'tools' : 'skills');
    }));

    // Helpers for smooth scroll with navbar offset
    const getNavHeight = () => {
      const navEl = nav as HTMLElement | null;
      return navEl ? navEl.getBoundingClientRect().height : 72;
    };

    const scrollToElementWithOffset = (el: HTMLElement) => {
      const top = el.getBoundingClientRect().top + window.scrollY - (getNavHeight() + 12);
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const scrollToSkills = (view: 'skills' | 'tools') => {
      setSkillsView(view);
      const target = view === 'skills'
        ? (document.getElementById('Skills') as HTMLElement | null)
        : ((document.getElementById('SkillsToggle') || document.getElementById('Skills')) as HTMLElement | null);
      if (target) scrollToElementWithOffset(target);
    };

    // Map lower‑case hashes to actual element ids used in the template
    const idMap: Record<string, string> = {
      home: 'home',
      about: 'About',
      services: 'services',
      skills: 'Skills',
      resume: 'Resume',
      portfolio: 'Portfolio',
      contact: 'Contact',
      tools: 'Tools'
    };

    const scrollToIdWithOffset = (rawHash: string) => {
      const key = rawHash.replace('#', '').toLowerCase();
      if (key === 'tools') return scrollToSkills('tools');
      if (key === 'skills') return scrollToSkills('skills');
      const id = idMap[key] || rawHash.replace('#', '');
      const target = document.getElementById(id);
      if (target) scrollToElementWithOffset(target);
    };

    // If the page loads with a hash, scroll to that section (with offset)
    const applyFromHash = () => {
      const hash = window.location.hash || '';
      if (!hash) return;
      scrollToIdWithOffset(hash);
    };
    applyFromHash();
    window.addEventListener('hashchange', applyFromHash);

    // Intercept navbar anchor clicks and perform our offset scroll
    document.querySelectorAll('nav a.nav-link[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = (a as HTMLAnchorElement).getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        e.preventDefault();
        history.replaceState(null, '', href);
        scrollToIdWithOffset(href);
      });
    });

    // Typed.js text animation 
    const typedLib = (window as any).Typed;
    if (typedLib) {
      new typedLib('.auto-input', {
        strings: ['a Full Stack Developer', 'a Tech Enthusiast', 'a UI/UX Designer', 'an Innovator'],
        typeSpeed: 20,
        backSpeed: 20,
        backDelay: 1500,
        loop: true,
        smartBackspace: true,
      });
    }

    // Particles.js background (if library present)
    const particles = (window as any).particlesJS;
    if (particles) {
      particles('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
          opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 5, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }
   
  }
}