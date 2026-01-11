import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import * as fc from 'fast-check';
import { NavigationComponent } from './navigation.component';
import { ScrollService, Section } from '../../services/scroll.service';
import { BehaviorSubject } from 'rxjs';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let mockScrollService: jasmine.SpyObj<ScrollService>;
  let activeSectionSubject: BehaviorSubject<string>;

  const requiredSections: Section[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  beforeEach(async () => {
    activeSectionSubject = new BehaviorSubject<string>('home');
    mockScrollService = jasmine.createSpyObj('ScrollService', [
      'getSections',
      'getActiveSection',
      'scrollToSection'
    ]);
    mockScrollService.getSections.and.returnValue(requiredSections);
    mockScrollService.getActiveSection.and.returnValue(activeSectionSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ScrollService, useValue: mockScrollService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load navigation items from ScrollService', () => {
    expect(component.navigationItems).toEqual(requiredSections);
  });

  /**
   * Feature: portfolio-website, Property 2: Navigation Links Completeness
   * *For any* navigation configuration, the Navigation component SHALL render 
   * links for all required sections (Home, About, Projects, Contact).
   * **Validates: Requirements 2.1**
   */
  describe('Property 2: Navigation Links Completeness', () => {
    it('should render links for all required sections regardless of order', () => {
      fc.assert(
        fc.property(
          fc.shuffledSubarray(requiredSections, { minLength: 4, maxLength: 4 }),
          (shuffledSections) => {
            // Update mock to return shuffled sections
            mockScrollService.getSections.and.returnValue(shuffledSections);
            
            // Reinitialize component
            component.ngOnInit();
            fixture.detectChanges();

            const compiled = fixture.nativeElement as HTMLElement;
            const desktopNavLinks = compiled.querySelectorAll('.desktop-nav .nav-link');
            const mobileNavLinks = compiled.querySelectorAll('.mobile-nav .nav-link');

            // Verify desktop nav has all required sections
            expect(desktopNavLinks.length).toBe(4);
            
            // Verify mobile nav has all required sections
            expect(mobileNavLinks.length).toBe(4);

            // Verify all required section IDs are present in desktop nav
            const desktopHrefs = Array.from(desktopNavLinks).map(link => 
              link.getAttribute('href')?.replace('#', '')
            );
            const requiredIds = ['home', 'about', 'projects', 'contact'];
            requiredIds.forEach(id => {
              expect(desktopHrefs).toContain(id);
            });

            // Verify all required section IDs are present in mobile nav
            const mobileHrefs = Array.from(mobileNavLinks).map(link => 
              link.getAttribute('href')?.replace('#', '')
            );
            requiredIds.forEach(id => {
              expect(mobileHrefs).toContain(id);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render correct labels for all navigation items', () => {
      fc.assert(
        fc.property(
          fc.shuffledSubarray(requiredSections, { minLength: 4, maxLength: 4 }),
          (shuffledSections) => {
            mockScrollService.getSections.and.returnValue(shuffledSections);
            component.ngOnInit();
            fixture.detectChanges();

            const compiled = fixture.nativeElement as HTMLElement;
            const desktopNavLinks = compiled.querySelectorAll('.desktop-nav .nav-link');

            // Verify all labels are rendered
            const renderedLabels = Array.from(desktopNavLinks).map(link => 
              link.textContent?.trim()
            );
            const expectedLabels = ['Home', 'About', 'Projects', 'Contact'];
            
            expectedLabels.forEach(label => {
              expect(renderedLabels).toContain(label);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always include all four required sections', () => {
      fc.assert(
        fc.property(
          fc.constant(requiredSections),
          (sections) => {
            mockScrollService.getSections.and.returnValue(sections);
            component.ngOnInit();
            fixture.detectChanges();

            // Verify component has all navigation items
            expect(component.navigationItems.length).toBe(4);
            
            const sectionIds = component.navigationItems.map(item => item.id);
            expect(sectionIds).toContain('home');
            expect(sectionIds).toContain('about');
            expect(sectionIds).toContain('projects');
            expect(sectionIds).toContain('contact');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Navigation functionality', () => {
    it('should call scrollToSection when navigating', () => {
      component.navigateToSection('about');
      expect(mockScrollService.scrollToSection).toHaveBeenCalledWith('about');
    });

    it('should close mobile menu when navigating', () => {
      component.isMobileMenuOpen = true;
      component.navigateToSection('projects');
      expect(component.isMobileMenuOpen).toBeFalse();
    });

    it('should toggle mobile menu state', () => {
      expect(component.isMobileMenuOpen).toBeFalse();
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen).toBeTrue();
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen).toBeFalse();
    });

    it('should correctly identify active section', () => {
      expect(component.isActive('home')).toBeTrue();
      expect(component.isActive('about')).toBeFalse();
      
      activeSectionSubject.next('about');
      expect(component.isActive('about')).toBeTrue();
      expect(component.isActive('home')).toBeFalse();
    });
  });
});
