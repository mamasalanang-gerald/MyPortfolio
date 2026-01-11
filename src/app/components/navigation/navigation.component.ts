import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollService, Section } from '../../services/scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {
  private scrollService = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  private activeSectionSubscription?: Subscription;

  navigationItems: Section[] = [];
  activeSection = 'home';
  isMobileMenuOpen = false;

  ngOnInit(): void {
    this.navigationItems = this.scrollService.getSections();
    this.activeSectionSubscription = this.scrollService.getActiveSection().subscribe(
      (section) => {
        this.activeSection = section;
      }
    );
  }

  ngOnDestroy(): void {
    this.activeSectionSubscription?.unsubscribe();
  }

  navigateToSection(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }
}
