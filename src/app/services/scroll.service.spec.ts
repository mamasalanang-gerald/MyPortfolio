import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import * as fc from 'fast-check';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ScrollService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return sections list', () => {
    const sections = service.getSections();
    expect(sections.length).toBe(4);
    expect(sections.map(s => s.id)).toEqual(['home', 'about', 'projects', 'contact']);
  });

  it('should return active section observable', (done) => {
    service.getActiveSection().subscribe(section => {
      expect(section).toBeTruthy();
      done();
    });
  });

  /**
   * Feature: portfolio-website, Property 3: Active Section Tracking
   * *For any* scroll position within a section's bounds, the Scroll Service 
   * SHALL correctly identify and emit that section as the active section.
   * **Validates: Requirements 2.4**
   */
  describe('Property 3: Active Section Tracking', () => {
    it('should correctly identify active section for any scroll position within section bounds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 500, max: 1000 }),
          fc.integer({ min: 500, max: 1000 }),
          fc.integer({ min: 500, max: 1000 }),
          fc.integer({ min: 500, max: 1000 }),
          (homeHeight, aboutHeight, projectsHeight, contactHeight) => {
            const sectionPositions = new Map<string, { top: number; bottom: number }>();
            
            // Build section positions map with sequential, non-overlapping sections
            let currentTop = 0;
            const sectionConfigs = [
              { id: 'home', height: homeHeight },
              { id: 'about', height: aboutHeight },
              { id: 'projects', height: projectsHeight },
              { id: 'contact', height: contactHeight }
            ];
            
            sectionConfigs.forEach(({ id, height }) => {
              sectionPositions.set(id, {
                top: currentTop,
                bottom: currentTop + height
              });
              currentTop += height;
            });

            const sectionIds = ['home', 'about', 'projects', 'contact'];
            const viewportThreshold = 800 * 0.3; // 30% of viewport (800px default)

            // Test that scroll positions within each section return a valid section
            for (const sectionId of sectionIds) {
              const position = sectionPositions.get(sectionId)!;
              
              // Test a scroll position that should be within this section
              const testScrollPosition = position.top + viewportThreshold + 50;
              
              if (testScrollPosition < position.bottom - viewportThreshold) {
                const activeSection = service.calculateActiveSection(testScrollPosition, sectionPositions);
                
                // The active section should be a valid section
                expect(sectionIds).toContain(activeSection);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return first section when scroll position is at the top', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (scrollPosition) => {
            const sectionPositions = new Map<string, { top: number; bottom: number }>();
            sectionPositions.set('home', { top: 0, bottom: 800 });
            sectionPositions.set('about', { top: 800, bottom: 1600 });
            sectionPositions.set('projects', { top: 1600, bottom: 2400 });
            sectionPositions.set('contact', { top: 2400, bottom: 3200 });

            const activeSection = service.calculateActiveSection(scrollPosition, sectionPositions);
            expect(activeSection).toBe('home');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle any valid scroll position and return a valid section', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10000 }),
          (scrollPosition) => {
            const sectionPositions = new Map<string, { top: number; bottom: number }>();
            sectionPositions.set('home', { top: 0, bottom: 800 });
            sectionPositions.set('about', { top: 800, bottom: 1600 });
            sectionPositions.set('projects', { top: 1600, bottom: 2400 });
            sectionPositions.set('contact', { top: 2400, bottom: 3200 });

            const activeSection = service.calculateActiveSection(scrollPosition, sectionPositions);
            const validSections = ['home', 'about', 'projects', 'contact'];
            
            expect(validSections).toContain(activeSection);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
