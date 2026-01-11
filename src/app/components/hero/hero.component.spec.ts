import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, ChangeDetectorRef } from '@angular/core';
import * as fc from 'fast-check';
import { HeroComponent } from './hero.component';
import { ScrollService } from '../../services/scroll.service';
import { Profile } from '../../models/profile.model';
import { BehaviorSubject } from 'rxjs';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockScrollService: jasmine.SpyObj<ScrollService>;

  beforeEach(async () => {
    mockScrollService = jasmine.createSpyObj('ScrollService', [
      'scrollToSection',
      'getActiveSection',
      'getSections'
    ]);
    mockScrollService.getActiveSection.and.returnValue(new BehaviorSubject<string>('home').asObservable());
    mockScrollService.getSections.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ScrollService, useValue: mockScrollService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display profile name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.hero__name');
    expect(nameElement?.textContent).toContain(component.profile.name);
  });

  it('should display profile title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.hero__title');
    expect(titleElement?.textContent).toContain(component.profile.title);
  });

  it('should display tagline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const taglineElement = compiled.querySelector('.hero__tagline');
    expect(taglineElement?.textContent).toContain(component.profile.tagline);
  });

  it('should have call-to-action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaButtons = compiled.querySelectorAll('.hero__cta');
    expect(ctaButtons.length).toBe(2);
  });

  it('should scroll to projects when primary CTA is clicked', () => {
    component.scrollToProjects();
    expect(mockScrollService.scrollToSection).toHaveBeenCalledWith('projects');
  });

  it('should scroll to contact when secondary CTA is clicked', () => {
    component.scrollToContact();
    expect(mockScrollService.scrollToSection).toHaveBeenCalledWith('contact');
  });

  /**
   * Feature: portfolio-website, Property 1: Hero Content Rendering
   * *For any* valid Profile object with name and title fields, the Hero component 
   * SHALL render both the name and title/tagline in the output.
   * **Validates: Requirements 1.1, 1.2**
   */
  describe('Property 1: Hero Content Rendering', () => {
    // Generator for valid Profile objects
    const profileArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      tagline: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
      bio: fc.string({ minLength: 1, maxLength: 500 }),
      photoUrl: fc.option(fc.webUrl(), { nil: undefined }),
      email: fc.emailAddress(),
      skills: fc.array(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          category: fc.constantFrom('frontend', 'backend', 'tools', 'other') as fc.Arbitrary<'frontend' | 'backend' | 'tools' | 'other'>,
          icon: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
        }),
        { minLength: 0, maxLength: 10 }
      ),
      socialLinks: fc.array(
        fc.record({
          platform: fc.string({ minLength: 1, maxLength: 30 }),
          url: fc.webUrl(),
          icon: fc.string({ minLength: 1, maxLength: 20 })
        }),
        { minLength: 0, maxLength: 5 }
      )
    }) as fc.Arbitrary<Profile>;

    it('should render name and title for any valid profile', () => {
      fc.assert(
        fc.property(profileArbitrary, (profile: Profile) => {
          // Create a fresh component for each test iteration
          const testFixture = TestBed.createComponent(HeroComponent);
          const testComponent = testFixture.componentInstance;
          
          // Set profile before initial change detection
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const nameElement = compiled.querySelector('.hero__name');
          const titleElement = compiled.querySelector('.hero__title');

          // Verify name is rendered
          expect(nameElement).toBeTruthy();
          expect(nameElement?.textContent).toContain(profile.name);

          // Verify title is rendered
          expect(titleElement).toBeTruthy();
          expect(titleElement?.textContent).toContain(profile.title);
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should render tagline for any valid profile', () => {
      fc.assert(
        fc.property(profileArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(HeroComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const taglineElement = compiled.querySelector('.hero__tagline');

          // Verify tagline is rendered
          expect(taglineElement).toBeTruthy();
          expect(taglineElement?.textContent).toContain(profile.tagline);
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should always have CTA buttons regardless of profile content', () => {
      fc.assert(
        fc.property(profileArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(HeroComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const ctaButtons = compiled.querySelectorAll('.hero__cta');

          // Verify CTA buttons are always present
          expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });
  });
});
