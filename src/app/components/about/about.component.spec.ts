import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import * as fc from 'fast-check';
import { AboutComponent } from './about.component';
import { Profile, Skill } from '../../models/profile.model';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  // Generator for valid Profile objects
  const skillArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim()).filter(s => s.length > 0),
    category: fc.constantFrom('frontend', 'backend', 'tools', 'other') as fc.Arbitrary<'frontend' | 'backend' | 'tools' | 'other'>,
    icon: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
  });

  const profileArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
    title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
    tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
    bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
    photoUrl: fc.option(fc.webUrl(), { nil: undefined }),
    email: fc.emailAddress(),
    skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 15 }),
    socialLinks: fc.array(
      fc.record({
        platform: fc.string({ minLength: 1, maxLength: 30 }),
        url: fc.webUrl(),
        icon: fc.string({ minLength: 1, maxLength: 20 })
      }),
      { minLength: 0, maxLength: 5 }
    )
  }) as fc.Arbitrary<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display bio text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const bioElement = compiled.querySelector('.about__bio-text');
    expect(bioElement?.textContent).toContain(component.profile.bio);
  });

  it('should display skills grouped by category', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillCategories = compiled.querySelectorAll('.about__skill-category');
    expect(skillCategories.length).toBeGreaterThan(0);
  });

  it('should filter frontend skills correctly', () => {
    const frontendSkills = component.frontendSkills;
    frontendSkills.forEach(skill => {
      expect(skill.category).toBe('frontend');
    });
  });

  it('should filter backend skills correctly', () => {
    const backendSkills = component.backendSkills;
    backendSkills.forEach(skill => {
      expect(skill.category).toBe('backend');
    });
  });

  /**
   * Feature: portfolio-website, Property 4: Profile Data Rendering
   * *For any* valid Profile object, the About component SHALL render the bio text 
   * and all skills from the skills array.
   * **Validates: Requirements 3.1, 3.2**
   */
  describe('Property 4: Profile Data Rendering', () => {
    it('should render bio and all skills for any valid profile', () => {
      fc.assert(
        fc.property(profileArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          
          // Verify bio is rendered
          const bioElement = compiled.querySelector('.about__bio-text');
          expect(bioElement).toBeTruthy();
          expect(bioElement?.textContent).toContain(profile.bio);

          // Verify all skills are rendered
          const skillItems = compiled.querySelectorAll('.about__skill-item');
          const renderedSkillNames = Array.from(skillItems).map(el => el.textContent?.trim());
          
          profile.skills.forEach(skill => {
            // Check if any rendered skill name matches the trimmed skill name
            const skillNameTrimmed = skill.name.trim();
            const found = renderedSkillNames.some(rendered => rendered === skillNameTrimmed);
            expect(found).withContext(`Skill "${skillNameTrimmed}" should be rendered`).toBeTrue();
          });
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: portfolio-website, Property 5: Conditional Photo Display
   * *For any* Profile object, the About component SHALL render a profile photo 
   * if and only if photoUrl is defined and non-empty.
   * **Validates: Requirements 3.3**
   */
  describe('Property 5: Conditional Photo Display', () => {
    // Profile with valid photo URL
    const profileWithPhotoArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
      bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
      photoUrl: fc.webUrl(),
      email: fc.emailAddress(),
      skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
      socialLinks: fc.array(
        fc.record({
          platform: fc.string({ minLength: 1, maxLength: 30 }),
          url: fc.webUrl(),
          icon: fc.string({ minLength: 1, maxLength: 20 })
        }),
        { minLength: 0, maxLength: 5 }
      )
    }) as fc.Arbitrary<Profile>;

    // Profile without photo URL
    const profileWithoutPhotoArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
      bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
      photoUrl: fc.constant(undefined),
      email: fc.emailAddress(),
      skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
      socialLinks: fc.array(
        fc.record({
          platform: fc.string({ minLength: 1, maxLength: 30 }),
          url: fc.webUrl(),
          icon: fc.string({ minLength: 1, maxLength: 20 })
        }),
        { minLength: 0, maxLength: 5 }
      )
    }) as fc.Arbitrary<Profile>;

    // Profile with empty string photo URL
    const profileWithEmptyPhotoArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
      tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
      bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
      photoUrl: fc.constantFrom('', '   ', '\t', '\n'),
      email: fc.emailAddress(),
      skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
      socialLinks: fc.array(
        fc.record({
          platform: fc.string({ minLength: 1, maxLength: 30 }),
          url: fc.webUrl(),
          icon: fc.string({ minLength: 1, maxLength: 20 })
        }),
        { minLength: 0, maxLength: 5 }
      )
    }) as fc.Arbitrary<Profile>;

    it('should display photo when photoUrl is defined and non-empty', () => {
      fc.assert(
        fc.property(profileWithPhotoArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const photoElement = compiled.querySelector('.about__photo');
          
          expect(photoElement).toBeTruthy();
          expect(photoElement?.getAttribute('src')).toBe(profile.photoUrl);
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should NOT display photo when photoUrl is undefined', () => {
      fc.assert(
        fc.property(profileWithoutPhotoArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const photoElement = compiled.querySelector('.about__photo');
          
          expect(photoElement).toBeFalsy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should NOT display photo when photoUrl is empty or whitespace', () => {
      fc.assert(
        fc.property(profileWithEmptyPhotoArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const photoElement = compiled.querySelector('.about__photo');
          
          expect(photoElement).toBeFalsy();
          
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
    it('Property 10: should have non-empty alt attribute on profile photo when displayed', () => {
      fc.assert(
        fc.property(profileWithPhotoArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
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

    it('Property 10: should include profile name in alt text for profile photo', () => {
      fc.assert(
        fc.property(profileWithPhotoArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(AboutComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          const photoElement = compiled.querySelector('.about__photo') as HTMLImageElement;
          
          if (photoElement) {
            const altText = photoElement.getAttribute('alt');
            expect(altText).toBeTruthy();
            // Alt text should contain the profile name for context
            expect(altText?.toLowerCase()).toContain(profile.name.toLowerCase());
          }
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });
  });
});
