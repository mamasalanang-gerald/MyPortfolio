import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navigation')).toBeTruthy();
  });

  it('should render all section components', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero')).toBeTruthy();
    expect(compiled.querySelector('app-about')).toBeTruthy();
    expect(compiled.querySelector('app-projects')).toBeTruthy();
    expect(compiled.querySelector('app-contact')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should have section IDs for scroll navigation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#home')).toBeTruthy();
    expect(compiled.querySelector('#about')).toBeTruthy();
    expect(compiled.querySelector('#projects')).toBeTruthy();
    expect(compiled.querySelector('#contact')).toBeTruthy();
  });
});
