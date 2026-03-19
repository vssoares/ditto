import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  host: { class: 'inline-flex' },
  imports: [NgClass],
  template: `
    <span class="group relative inline-flex">
      <ng-content />
      <span
        class="pointer-events-none absolute px-2 py-1 rounded-md bg-ink-900 border border-ink-700 text-[10px] font-mono text-chalk/80 whitespace-nowrap z-20
        opacity-0 transition-all duration-150
        "
        [ngClass]="positionClasses()">
        {{ text }}
      </span>
    </span>
  `,
})
export class TooltipComponent {
  @Input({ required: true }) text = '';
  @Input() position: TooltipPosition = 'top';

  positionClasses(): string {
    switch (this.position) {
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0';
      case 'bottom':
        return 'top-full mt-1 left-1/2 -translate-x-1/2 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0';
      case 'top':
      default:
        return 'bottom-full mb-1 left-1/2 -translate-x-1/2 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0';
    }
  }
}

