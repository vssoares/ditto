import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';
  @Input() tooltipPosition: TooltipPosition = 'top';

  private tooltipEl: HTMLElement | null = null;
  private hideTimeout: number | null = null;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    if (!this.text?.trim() || this.tooltipEl) return;

    const el = this.renderer.createElement('div') as HTMLElement;
    el.textContent = this.text;
    this.renderer.setStyle(el, 'position', 'fixed');
    this.renderer.setStyle(el, 'z-index', '1000');
    this.renderer.setStyle(el, 'pointer-events', 'none');
    this.renderer.setStyle(el, 'transition', 'opacity 150ms ease, transform 150ms ease');
    this.renderer.setStyle(el, 'padding', '4px 8px');
    this.renderer.setStyle(el, 'border-radius', '6px');
    this.renderer.setStyle(el, 'font-size', '10px');
    this.renderer.setStyle(el, 'font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace');
    this.renderer.setStyle(el, 'white-space', 'nowrap');
    this.renderer.setStyle(el, 'background', 'rgba(3, 7, 18, 0.98)');
    this.renderer.setStyle(el, 'color', 'rgba(226, 232, 240, 0.9)');
    this.renderer.setStyle(el, 'border', '1px solid rgba(51, 65, 85, 0.8)');
    this.renderer.setStyle(el, 'box-shadow', '0 6px 16px rgba(0, 0, 0, 0.35)');
    this.renderer.appendChild(this.doc.body, el);

    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    const gap = 8;

    let top = hostRect.top - tipRect.height - gap;
    let left = hostRect.left + (hostRect.width - tipRect.width) / 2;

    if (this.tooltipPosition === 'right') {
      top = hostRect.top + (hostRect.height - tipRect.height) / 2;
      left = hostRect.right + gap;
    } else if (this.tooltipPosition === 'bottom') {
      top = hostRect.bottom + gap;
      left = hostRect.left + (hostRect.width - tipRect.width) / 2;
    } else if (this.tooltipPosition === 'left') {
      top = hostRect.top + (hostRect.height - tipRect.height) / 2;
      left = hostRect.left - tipRect.width - gap;
    }

    const maxLeft = window.innerWidth - tipRect.width - 8;
    const maxTop = window.innerHeight - tipRect.height - 8;
    left = Math.max(8, Math.min(left, maxLeft));
    top = Math.max(8, Math.min(top, maxTop));

    this.renderer.setStyle(el, 'left', `${left}px`);
    this.renderer.setStyle(el, 'top', `${top}px`);

    // Estado inicial (parecido com group-hover: opacity/translate).
    this.renderer.setStyle(el, 'opacity', '0');
    const initialTranslate =
      this.tooltipPosition === 'right'
        ? 'translateX(1px)'
        : this.tooltipPosition === 'left'
          ? 'translateX(-1px)'
          : this.tooltipPosition === 'bottom'
            ? 'translateY(1px)'
            : 'translateY(-1px)';
    this.renderer.setStyle(el, 'transform', initialTranslate);

    this.tooltipEl = el;

    // Ativa animação no próximo frame.
    requestAnimationFrame(() => {
      if (!this.tooltipEl || this.tooltipEl !== el) return;
      this.renderer.setStyle(el, 'opacity', '1');
      this.renderer.setStyle(el, 'transform', 'translate(0, 0)');
    });
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hide(): void {
    if (!this.tooltipEl) return;

    const el = this.tooltipEl;
    this.tooltipEl = null;

    // Pequeno "fade out" antes de remover.
    const finalTranslate =
      this.tooltipPosition === 'right'
        ? 'translateX(1px)'
        : this.tooltipPosition === 'left'
          ? 'translateX(-1px)'
          : this.tooltipPosition === 'bottom'
            ? 'translateY(1px)'
            : 'translateY(-1px)';

    this.renderer.setStyle(el, 'opacity', '0');
    this.renderer.setStyle(el, 'transform', finalTranslate);

    if (this.hideTimeout) window.clearTimeout(this.hideTimeout);
    this.hideTimeout = window.setTimeout(() => {
      // Pode ter sido removido por um show() rápido.
      try {
        if (el.parentElement === this.doc.body) this.renderer.removeChild(this.doc.body, el);
      } finally {
        if (this.hideTimeout) window.clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    }, 170);
  }

  ngOnDestroy(): void {
    this.hide();
  }
}

