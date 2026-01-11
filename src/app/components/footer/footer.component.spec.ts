import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FooterComponent } from './footer.component';
import { PROFILE_DATA } from '../../data/profile.data';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in copyright', () => {
    const currentYear = new Date().getFullYear();
    const compiled = fixture.nativeElement as HTMLElement;
    const copyright = compiled.querySelector('.copyright');
    expect(copyright?.textContent).toContain(currentYear.toString());
  });

  it('should display the profile name in copyright', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const copyright = compiled.querySelector('.copyright');
    expect(copyright?.textContent).toContain(PROFILE_DATA.name);
  });

  it('should render all footer navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.footer-link');
    expect(links.length).toBe(4);
  });

  it('should render all social links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialLinks = compiled.querySelectorAll('.social-link');
    expect(socialLinks.length).toBe(PROFILE_DATA.socialLinks.length);
  });

  it('should display the profile tagline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tagline = compiled.querySelector('.footer-tagline');
    expect(tagline?.textContent).toContain(PROFILE_DATA.tagline);
  });
});
