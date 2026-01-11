import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import * as fc from 'fast-check';
import { ContactComponent } from './contact.component';
import { Profile, SocialLink } from '../../models/profile.model';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  // Generator for valid Skill objects
  const skillArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim()).filter(s => s.length > 0),
    category: fc.constantFrom('frontend', 'backend', 'tools', 'other') as fc.Arbitrary<'frontend' | 'backend' | 'tools' | 'other'>,
    icon: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined })
  });

  // Generator for valid SocialLink objects
  const socialLinkArbitrary = fc.record({
    platform: fc.string({ minLength: 1, maxLength: 30 }).map(s => s.trim()).filter(s => s.length > 0),
    url: fc.webUrl(),
    icon: fc.string({ minLength: 1, maxLength: 20 }).map(s => s.trim()).filter(s => s.length > 0)
  }) as fc.Arbitrary<SocialLink>;

  // Generator for valid Profile objects with email and social links
  const profileArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
    title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
    tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
    bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
    photoUrl: fc.option(fc.webUrl(), { nil: undefined }),
    email: fc.emailAddress(),
    skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
    socialLinks: fc.array(socialLinkArbitrary, { minLength: 1, maxLength: 5 })
  }) as fc.Arbitrary<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display email address', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const emailElement = compiled.querySelector('.contact__email');
    expect(emailElement?.textContent?.trim()).toBe(component.profile.email);
  });

  it('should display social links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.contact__social-link');
    expect(socialLinks.length).toBe(component.profile.socialLinks.length);
  });

  /**
   * Feature: portfolio-website, Property 8: Contact Information Display
   * *For any* valid Profile object with email and socialLinks, the Contact component 
   * SHALL render the email and all social link entries.
   * **Validates: Requirements 5.1**
   */
  describe('Property 8: Contact Information Display', () => {
    it('should render email and all social links for any valid profile', () => {
      fc.assert(
        fc.property(profileArbitrary, (profile: Profile) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          
          // Verify email is rendered
          const emailElement = compiled.querySelector('.contact__email');
          expect(emailElement).toBeTruthy();
          expect(emailElement?.textContent?.trim()).toBe(profile.email);
          expect(emailElement?.getAttribute('href')).toBe(`mailto:${profile.email}`);

          // Verify all social links are rendered
          const socialLinkElements = compiled.querySelectorAll('.contact__social-link');
          expect(socialLinkElements.length).toBe(profile.socialLinks.length);

          // Verify each social link has correct URL and platform name
          profile.socialLinks.forEach((link, index) => {
            const linkElement = socialLinkElements[index];
            expect(linkElement.getAttribute('href')).toBe(link.url);
            
            const platformName = linkElement.querySelector('.contact__social-name');
            expect(platformName?.textContent?.trim()).toBe(link.platform);
          });
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should render email even when socialLinks is empty', () => {
      const profileWithNoSocialLinks = fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
        title: fc.string({ minLength: 1, maxLength: 100 }).map(s => s.trim()).filter(s => s.length > 0),
        tagline: fc.string({ minLength: 1, maxLength: 200 }).map(s => s.trim()).filter(s => s.length > 0),
        bio: fc.string({ minLength: 1, maxLength: 500 }).map(s => s.trim()).filter(s => s.length > 0),
        photoUrl: fc.option(fc.webUrl(), { nil: undefined }),
        email: fc.emailAddress(),
        skills: fc.array(skillArbitrary, { minLength: 1, maxLength: 10 }),
        socialLinks: fc.constant([])
      }) as fc.Arbitrary<Profile>;

      fc.assert(
        fc.property(profileWithNoSocialLinks, (profile: Profile) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          
          testComponent.profile = profile;
          testFixture.detectChanges();

          const compiled = testFixture.nativeElement as HTMLElement;
          
          // Verify email is still rendered
          const emailElement = compiled.querySelector('.contact__email');
          expect(emailElement).toBeTruthy();
          expect(emailElement?.textContent?.trim()).toBe(profile.email);

          // Verify no social links are rendered
          const socialLinkElements = compiled.querySelectorAll('.contact__social-link');
          expect(socialLinkElements.length).toBe(0);
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: portfolio-website, Property 9: Form Validation - Invalid Inputs
   * *For any* contact form submission where required fields are empty or email format 
   * is invalid, the form validation SHALL return errors and prevent submission.
   * **Validates: Requirements 5.3**
   */
  describe('Property 9: Form Validation - Invalid Inputs', () => {
    // Generator for empty strings only (Angular's required validator only checks for empty)
    const emptyStringArbitrary = fc.constant('');

    // Generator for short names (0-1 characters, triggers minLength(2) validation)
    const shortNameArbitrary = fc.string({ minLength: 0, maxLength: 1 });

    // Generator for short messages (0-9 characters, triggers minLength(10) validation)
    const shortMessageArbitrary = fc.string({ minLength: 0, maxLength: 9 });

    // Generator for invalid email formats that Angular's Validators.email rejects
    // Angular's email validator uses a regex that requires @ with text on both sides and a dot in domain
    const invalidEmailArbitrary = fc.oneof(
      fc.constant(''),                                    // empty - triggers required
      fc.constant('plaintext'),                           // no @ symbol
      fc.constant('@nodomain.com'),                       // no local part
      fc.constant('noatsign.com'),                        // no @ symbol
      fc.constant('missing@'),                            // no domain
      fc.constant('spaces in@email.com'),                 // spaces in local part
      fc.constant('double@@at.com')                       // double @
    );

    it('should mark form as invalid when name is empty', () => {
      fc.assert(
        fc.property(emptyStringArbitrary, (emptyName: string) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          testFixture.detectChanges();

          testComponent.contactForm.patchValue({
            name: emptyName,
            email: 'valid@email.com',
            message: 'This is a valid message with enough characters'
          });

          expect(testComponent.contactForm.valid).toBeFalse();
          expect(testComponent.nameControl?.errors?.['required']).toBeTruthy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should mark form as invalid when email is empty or invalid format', () => {
      fc.assert(
        fc.property(invalidEmailArbitrary, (invalidEmail: string) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          testFixture.detectChanges();

          testComponent.contactForm.patchValue({
            name: 'Valid Name',
            email: invalidEmail,
            message: 'This is a valid message with enough characters'
          });

          expect(testComponent.contactForm.valid).toBeFalse();
          expect(testComponent.emailControl?.errors?.['required'] || 
                 testComponent.emailControl?.errors?.['email']).toBeTruthy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should mark form as invalid when message is empty', () => {
      fc.assert(
        fc.property(emptyStringArbitrary, (emptyMessage: string) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          testFixture.detectChanges();

          testComponent.contactForm.patchValue({
            name: 'Valid Name',
            email: 'valid@email.com',
            message: emptyMessage
          });

          expect(testComponent.contactForm.valid).toBeFalse();
          expect(testComponent.messageControl?.errors?.['required']).toBeTruthy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should mark form as invalid when name is too short', () => {
      fc.assert(
        fc.property(shortNameArbitrary, (shortName: string) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          testFixture.detectChanges();

          testComponent.contactForm.patchValue({
            name: shortName,
            email: 'valid@email.com',
            message: 'This is a valid message with enough characters'
          });

          expect(testComponent.contactForm.valid).toBeFalse();
          expect(testComponent.nameControl?.errors?.['required'] || 
                 testComponent.nameControl?.errors?.['minlength']).toBeTruthy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should mark form as invalid when message is too short', () => {
      fc.assert(
        fc.property(shortMessageArbitrary, (shortMessage: string) => {
          const testFixture = TestBed.createComponent(ContactComponent);
          const testComponent = testFixture.componentInstance;
          testFixture.detectChanges();

          testComponent.contactForm.patchValue({
            name: 'Valid Name',
            email: 'valid@email.com',
            message: shortMessage
          });

          expect(testComponent.contactForm.valid).toBeFalse();
          expect(testComponent.messageControl?.errors?.['required'] || 
                 testComponent.messageControl?.errors?.['minlength']).toBeTruthy();
          
          testFixture.destroy();
        }),
        { numRuns: 100 }
      );
    });

    it('should prevent form submission when form is invalid', () => {
      fc.assert(
        fc.property(
          fc.record({
            name: emptyStringArbitrary,
            email: invalidEmailArbitrary,
            message: emptyStringArbitrary
          }),
          (invalidData) => {
            const testFixture = TestBed.createComponent(ContactComponent);
            const testComponent = testFixture.componentInstance;
            testFixture.detectChanges();

            testComponent.contactForm.patchValue(invalidData);
            testComponent.onSubmit();

            // Form should be marked as submitted but not successful
            expect(testComponent.formSubmitted).toBeTrue();
            expect(testComponent.formSuccess).toBeFalse();
            expect(testComponent.contactForm.valid).toBeFalse();
            
            testFixture.destroy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
