import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive for scroll-triggered animations
 * Uses Intersection Observer to detect when elements enter the viewport
 * Applies animations with optional stagger effect
 *
 * Usage:
 * <div appScrollAnimate="fadeInUp" [stagger]="true" [staggerDelay]="50">
 *   Content
 * </div>
 */
@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() appScrollAnimate: string = 'fadeInUp';
  @Input() stagger: boolean = false;
  @Input() staggerDelay: number = 50;
  @Input() animationDuration: string = '0.6s';
  @Input() animationDelay: string = '0s';
  @Input() parallax: boolean = false;
  @Input() parallaxSpeed: number = 0.5;

  private intersectionObserver: IntersectionObserver | null = null;
  private hasAnimated: boolean = false;
  private scrollListener: (() => void) | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.setupIntersectionObserver();
    if (this.parallax) {
      this.setupParallax();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.triggerAnimation();
          this.hasAnimated = true;
        }
      });
    }, options);

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private triggerAnimation(): void {
    const element = this.elementRef.nativeElement;

    if (this.stagger) {
      this.applyStaggerAnimation(element);
    } else {
      this.applySingleAnimation(element);
    }
  }

  private applySingleAnimation(element: HTMLElement): void {
    this.renderer.addClass(element, `animate-${this.appScrollAnimate}`);
    this.renderer.setStyle(
      element,
      'animation-duration',
      this.animationDuration
    );
    this.renderer.setStyle(element, 'animation-delay', this.animationDelay);
  }

  private applyStaggerAnimation(element: HTMLElement): void {
    const children = element.children;

    Array.from(children).forEach((child, index) => {
      const delay = index * this.staggerDelay;
      this.renderer.addClass(child as HTMLElement, `animate-${this.appScrollAnimate}`);
      this.renderer.setStyle(
        child as HTMLElement,
        'animation-duration',
        this.animationDuration
      );
      this.renderer.setStyle(
        child as HTMLElement,
        'animation-delay',
        `${delay}ms`
      );
    });
  }

  private setupParallax(): void {
    this.scrollListener = () => {
      const element = this.elementRef.nativeElement;
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const distance = scrollY - elementTop;

      const offset = distance * this.parallaxSpeed;
      this.renderer.setStyle(
        element,
        'transform',
        `translateY(${offset}px)`
      );
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }
}
