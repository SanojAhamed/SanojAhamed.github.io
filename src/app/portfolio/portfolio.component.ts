import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  showMoreProjects = false;

  // Reveal hidden projects in the Portfolio section
  onViewMore(): void {
    this.showMoreProjects = true;
  }
}
