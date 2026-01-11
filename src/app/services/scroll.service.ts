import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Section {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private platformId = inject(PLATFORM_ID);
  private activeSectionSubject = new BehaviorSubject<string>('home');
  private sections: Section[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollListener();
    }
  }

  /**
   * Scrolls smoothly to the specified section
   * @param sectionId The ID of the section to scroll to
   */
  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Returns an observable that emits the currently active section ID
   */
  getActiveSection(): Observable<string> {
    return this.activeSectionSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  /**
   * Returns the current active section ID synchronously
   */
  getCurrentActiveSection(): string {
    return this.activeSectionSubject.getValue();
  }

  /**
   * Returns the list of available sections
   */
  getSections(): Section[] {
    return [...this.sections];
  }

  /**
   * Determines which section is active based on scroll position
   * Exported for testing purposes
   */
  calculateActiveSection(scrollPosition: number, sectionPositions: Map<string, { top: number; bottom: number }>): string {
    const viewportHeight = isPlatformBrowser(this.platformId) ? window.innerHeight : 800;
    const threshold = viewportHeight * 0.3; // 30% of viewport height

    for (const section of this.sections) {
      const position = sectionPositions.get(section.id);
      if (position) {
        // Check if the section is in the viewport
        const sectionTop = position.top - threshold;
        const sectionBottom = position.bottom - threshold;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          return section.id;
        }
      }
    }

    // Default to first section if no match
    return this.sections[0]?.id || 'home';
  }

  private initScrollListener(): void {
    fromEvent(window, 'scroll')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.updateActiveSection();
      });

    // Initial check
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scrollPosition = window.scrollY;
    const sectionPositions = this.getSectionPositions();
    const activeSection = this.calculateActiveSection(scrollPosition, sectionPositions);
    
    this.activeSectionSubject.next(activeSection);
  }

  private getSectionPositions(): Map<string, { top: number; bottom: number }> {
    const positions = new Map<string, { top: number; bottom: number }>();

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        positions.set(section.id, {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        });
      }
    }

    return positions;
  }
}
