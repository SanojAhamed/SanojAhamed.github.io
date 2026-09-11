import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private animationTimer?: number;
  private readonly roles = ['a Full Stack Developer', 'a UI/UX Designer', 'an Innovator', 'a Tech Enthusiast'];

  ngAfterViewInit(): void {
    const roleElement = document.querySelector<HTMLElement>('.auto-input');
    if (!roleElement) return;

    roleElement.textContent = '';
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    roleElement.classList.add('is-typing');
    const animateRole = () => {
      const role = this.roles[roleIndex];
      characterIndex += deleting ? -1 : 1;
      roleElement.textContent = role.slice(0, characterIndex);
      if (characterIndex === role.length) {
        deleting = true;
        roleElement.classList.remove('is-typing');
        roleElement.classList.add('is-holding');
        this.animationTimer = window.setTimeout(() => {
          roleElement.classList.remove('is-holding');
          roleElement.classList.add('is-deleting');
          animateRole();
        }, 1800);
        return;
      }
      if (characterIndex === 0 && deleting) {
        deleting = false;
        roleIndex = (roleIndex + 1) % this.roles.length;
        roleElement.classList.remove('is-deleting');
        roleElement.classList.add('is-typing');
      }
      this.animationTimer = window.setTimeout(animateRole, deleting ? 38 : 72);
    };

    this.animationTimer = window.setTimeout(animateRole, 450);
  }

  ngOnDestroy(): void {
    if (this.animationTimer) window.clearTimeout(this.animationTimer);
  }
}
