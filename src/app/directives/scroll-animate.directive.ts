import { Directive, ElementRef, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() appScrollAnimate: string = 'fadeInUp';
  @Input() animationDelay: number = 0;
  @Input() animationDuration: number = 600;

  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerAnimation();
          // Unobserve after animation is triggered
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private triggerAnimation(): void {
    const element = this.el.nativeElement;
    
    // Set animation properties
    element.style.animationName = this.appScrollAnimate;
    element.style.animationDuration = `${this.animationDuration}ms`;
    element.style.animationDelay = `${this.animationDelay}ms`;
    element.style.animationFillMode = 'forwards';
    element.style.animationTimingFunction = 'ease-out';
    
    // Add animation class
    element.classList.add(`animate-${this.appScrollAnimate}`);
  }
}
