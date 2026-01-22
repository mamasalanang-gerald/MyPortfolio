import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() appParallax: number = 0.5; // Parallax speed factor (0-1)
  @Input() maxOffset: number = 50; // Maximum pixel offset

  private initialY: number = 0;
  private scrollListener: (() => void) | null = null;
  private isMobile: boolean = false;
  private isBrowser: boolean = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.initialY = this.el.nativeElement.offsetTop;
    // Disable parallax on mobile for better performance
    if (!this.isMobile) {
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupScrollListener(): void {
    this.scrollListener = () => this.updateParallax();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private updateParallax(): void {
    const scrollY = window.scrollY;
    const elementTop = this.el.nativeElement.offsetTop;
    const elementHeight = this.el.nativeElement.offsetHeight;
    const windowHeight = window.innerHeight;

    // Check if element is in viewport
    if (elementTop + elementHeight > scrollY && elementTop < scrollY + windowHeight) {
      const distance = scrollY - this.initialY;
      const offset = Math.min(distance * this.appParallax, this.maxOffset);
      this.el.nativeElement.style.transform = `translateY(${offset}px)`;
    }
  }
}
