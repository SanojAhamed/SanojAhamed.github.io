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
    const nav = document.querySelector('nav') as HTMLElement | null;
    const navbarToggle = document.querySelector('.navbar-toggler') as HTMLElement | null;
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement | null;

    const addBgDarkToNavbar = () => {
      nav?.classList.add('bg-dark');
    };

    const removeBgDarkFromNavbar = () => {
      nav?.classList.remove('bg-dark');
    };

    const handleNavbarScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 100) {
        nav?.classList.add('shadow');
        addBgDarkToNavbar();
      } else {
        nav?.classList.remove('shadow');
        removeBgDarkFromNavbar();
      }
    };

    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);

    if (navbarToggle && navbarCollapse) {
      navbarToggle.addEventListener('click', () => {
        const isOpen = navbarCollapse.classList.toggle('show');
        navbarToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) addBgDarkToNavbar();
        else handleNavbarScroll();
      });
    }

    // close mobile navbar when clicking/touching outside the nav area
    const outsideClickHandler = (ev: MouseEvent | TouchEvent) => {
      const target = ev.target as Node | null;
      const collapse = navbarCollapse;
      if (!collapse || !collapse.matches('.show')) return;
      // clicked inside nav or on the toggler -> ignore
      if (nav && target && nav.contains(target)) return;
      if (navbarToggle && target && navbarToggle.contains(target)) return;
      navbarCollapse.classList.remove('show');
      navbarToggle?.setAttribute('aria-expanded', 'false');
      handleNavbarScroll();
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

    // Keep the current section visible in the navbar while the user scrolls.
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav a.nav-link[href^="#"]'));
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('href')?.slice(1) || ''))
      .filter((section): section is HTMLElement => section !== null);
    const setActiveNav = (sectionId: string) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveNav((visible.target as HTMLElement).id);
    }, { rootMargin: `-${nav?.getBoundingClientRect().height || 72}px 0px -55%`, threshold: [0.1, 0.5, 0.8] });
    sections.forEach((section) => sectionObserver.observe(section));
    setActiveNav('home');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const initializeParticles = () => {
      const particles = (window as any).particlesJS;
      if (!particles || reducedMotion) return;
      particles('particles-js', {
        particles: {
          number: { value: isMobile ? 28 : 55, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
          opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 5, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: isMobile ? 2 : 3, direction: 'none', random: false, straight: false, out_mode: 'out', attract: { enable: false, rotateX: 600, rotateY: 1200 } }
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
    };

    const loadParticles = () => {
      const script = document.createElement('script');
      script.src = 'assets/js/particles.js';
      script.onload = initializeParticles;
      document.head.appendChild(script);
    };
    const idle = (window as Window & { requestIdleCallback?: (callback: () => void) => number }).requestIdleCallback;
    if (!reducedMotion && !isMobile) {
      if (idle) idle(loadParticles);
      else window.setTimeout(loadParticles, 1200);
    }
   
  }
}