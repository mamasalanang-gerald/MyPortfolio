import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models/profile.model';
import { PROFILE_DATA } from '../../data/profile.data';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private scrollService = inject(ScrollService);
  
  profile: Profile = PROFILE_DATA;

  scrollToProjects(): void {
    this.scrollService.scrollToSection('projects');
  }

  scrollToContact(): void {
    this.scrollService.scrollToSection('contact');
  }
}
