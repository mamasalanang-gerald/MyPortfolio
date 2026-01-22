import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
  private observer?: IntersectionObserver;
  private observerInitialized = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Delay initialization to ensure DOM is ready
      setTimeout(() => this.initIntersectionObserver(), 100);
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
      // Update active section immediately
      this.activeSectionSubject.next(sectionId);
      
      // Then scroll to the section
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
    const navHeight = 80;
    const triggerPoint = scrollPosition + navHeight + 50;

    // Iterate through sections in order
    for (const section of this.sections) {
      const position = sectionPositions.get(section.id);
      if (position) {
        // Check if trigger point is within this section
        if (triggerPoint >= position.top && triggerPoint < position.bottom) {
          return section.id;
        }
      }
    }

    // Default to home if no match found
    return 'home';
  }

  private initIntersectionObserver(): void {
    if (this.observerInitialized) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      // Find the section that is most visible
      let mostVisibleSection = 'home';
      let maxVisibility = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibility = entry.intersectionRatio;
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = entry.target.id;
          }
        }
      });

      // If any section is intersecting, update active section
      if (maxVisibility > 0) {
        this.activeSectionSubject.next(mostVisibleSection);
      }
    }, {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
      threshold: 0
    });

    // Observe all sections
    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element && this.observer) {
        this.observer.observe(element);
      }
    }

    this.observerInitialized = true;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

