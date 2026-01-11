import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import * as fc from 'fast-check';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '../../../models/project.model';

// Arbitrary for generating valid Project objects
const projectArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  shortDescription: fc.string({ minLength: 1 }),
  thumbnailUrl: fc.webUrl(),
  images: fc.option(fc.array(fc.webUrl()), { nil: undefined }),
  technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
  sourceUrl: fc.option(fc.webUrl(), { nil: undefined }),
  featured: fc.boolean(),
  category: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  completedDate: fc.option(fc.date(), { nil: undefined })
});

// Helper to normalize URLs for comparison (browser may add trailing slashes)
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname.replace(/\/+$/, '') + parsed.search + parsed.hash;
  } catch {
    return url.replace(/\/+$/, '');
  }
}

describe('ProjectCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    const component = fixture.componentInstance;
    component.project = {
      id: 'test',
      title: 'Test Project',
      description: 'Test description',
      shortDescription: 'Short desc',
      thumbnailUrl: 'https://example.com/img.jpg',
      technologies: ['Angular'],
      featured: false
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  /**
   * Feature: portfolio-website, Property 6: Project Card Content
   * For any valid Project object, the rendered project card SHALL contain
   * the project's title, shortDescription, and thumbnailUrl.
   * Validates: Requirements 4.1
   */
  it('Property 6: should render title, shortDescription, and thumbnailUrl for any valid project', () => {
    fc.assert(
      fc.property(projectArbitrary, (project: Project) => {
        const testFixture = TestBed.createComponent(ProjectCardComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.project = project;
        testFixture.detectChanges();

        const compiled = testFixture.nativeElement as HTMLElement;
        
        // Check title is rendered (contains the title text)
        const titleElement = compiled.querySelector('.project-card__title');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain(project.title.trim());

        // Check short description is rendered (contains the description text)
        const descElement = compiled.querySelector('.project-card__description');
        expect(descElement).toBeTruthy();
        expect(descElement?.textContent).toContain(project.shortDescription.trim());

        // Check thumbnail URL is set (normalize URLs for comparison)
        const imgElement = compiled.querySelector('.project-card__image') as HTMLImageElement;
        expect(imgElement).toBeTruthy();
        expect(normalizeUrl(imgElement?.src || '')).toBe(normalizeUrl(project.thumbnailUrl));
        
        testFixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: portfolio-website, Property 7: Project Links Conditional Rendering
   * For any Project object with liveUrl or sourceUrl defined, the project details
   * SHALL include clickable links to those URLs. Projects without these URLs
   * SHALL not render broken or empty links.
   * Validates: Requirements 4.3
   */
  it('Property 7: should conditionally render links based on liveUrl and sourceUrl presence', () => {
    fc.assert(
      fc.property(projectArbitrary, (project: Project) => {
        const testFixture = TestBed.createComponent(ProjectCardComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.project = project;
        testFixture.detectChanges();

        const compiled = testFixture.nativeElement as HTMLElement;
        const liveLink = compiled.querySelector('a[aria-label*="live demo"]') as HTMLAnchorElement;
        const sourceLink = compiled.querySelector('a[aria-label*="source code"]') as HTMLAnchorElement;

        // If liveUrl is defined, link should exist and have correct href
        if (project.liveUrl) {
          expect(liveLink).toBeTruthy();
          // Normalize URLs for comparison (browser may add trailing slashes)
          expect(normalizeUrl(liveLink?.href || '')).toBe(normalizeUrl(project.liveUrl));
        } else {
          // If liveUrl is not defined, link should not exist
          expect(liveLink).toBeFalsy();
        }

        // If sourceUrl is defined, link should exist and have correct href
        if (project.sourceUrl) {
          expect(sourceLink).toBeTruthy();
          // Normalize URLs for comparison (browser may add trailing slashes)
          expect(normalizeUrl(sourceLink?.href || '')).toBe(normalizeUrl(project.sourceUrl));
        } else {
          // If sourceUrl is not defined, link should not exist
          expect(sourceLink).toBeFalsy();
        }
        
        testFixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: portfolio-website, Property 10: Image Accessibility
   * *For any* image element rendered in the portfolio, the element SHALL have 
   * a non-empty alt attribute.
   * **Validates: Requirements 7.3**
   */
  it('Property 10: should have non-empty alt attribute on project thumbnail', () => {
    fc.assert(
      fc.property(projectArbitrary, (project: Project) => {
        const testFixture = TestBed.createComponent(ProjectCardComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.project = project;
        testFixture.detectChanges();

        const compiled = testFixture.nativeElement as HTMLElement;
        const images = compiled.querySelectorAll('img');
        
        // For each image, verify it has a non-empty alt attribute
        images.forEach((img: HTMLImageElement) => {
          const altText = img.getAttribute('alt');
          expect(altText).toBeTruthy();
          expect(altText?.trim().length).toBeGreaterThan(0);
        });
        
        testFixture.destroy();
      }),
      { numRuns: 100 }
    );
  });

  it('Property 10: should include project title in alt text for thumbnail', () => {
    fc.assert(
      fc.property(projectArbitrary, (project: Project) => {
        const testFixture = TestBed.createComponent(ProjectCardComponent);
        const testComponent = testFixture.componentInstance;
        
        testComponent.project = project;
        testFixture.detectChanges();

        const compiled = testFixture.nativeElement as HTMLElement;
        const thumbnailImg = compiled.querySelector('.project-card__image') as HTMLImageElement;
        
        if (thumbnailImg) {
          const altText = thumbnailImg.getAttribute('alt');
          expect(altText).toBeTruthy();
          // Alt text should contain the project title for context
          expect(altText?.toLowerCase()).toContain(project.title.toLowerCase().trim());
        }
        
        testFixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});
