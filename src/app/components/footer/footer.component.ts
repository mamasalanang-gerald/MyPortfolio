import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE_DATA } from '../../data/profile.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  profile = PROFILE_DATA;

  footerLinks = [
    { label: 'Home', sectionId: 'home' },
    { label: 'About', sectionId: 'about' },
    { label: 'Projects', sectionId: 'projects' },
    { label: 'Contact', sectionId: 'contact' }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
