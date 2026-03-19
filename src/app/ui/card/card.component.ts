import { Component, computed, input, output } from '@angular/core';

const VARIANTS: Record<string, string> = {
  default: 'bg-ink-800 border border-ink-600',
  active: 'bg-ink-800 border border-amber-500/30',
  highlight: 'bg-ink-800 border border-amber-500',
  flat: 'bg-ink-800',
};

@Component({
  selector: 'ui-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  readonly variant = input<string>('default');
  readonly hoverable = input(false);
  readonly className = input('');
  readonly clicked = output<void>();

  readonly classes = computed(() =>
    [
      'rounded-xl transition-all duration-150',
      VARIANTS[this.variant()] ?? VARIANTS['default'],
      this.hoverable() ? 'hover:border-ink-500 cursor-pointer' : '',
      this.className(),
    ].filter(Boolean).join(' ')
  );
}
