import { Component, computed, input } from '@angular/core';

const RATING_COLORS: Record<string, string> = {
  easy: 'text-green-400',
  ok: 'text-blue-400',
  hard: 'text-orange-400',
  again: 'text-red-400',
};

@Component({
  selector: 'ui-badge',
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  readonly variant = input<'keyword' | 'rating' | 'status'>('keyword');
  readonly rating = input<string>('');
  readonly className = input('');

  readonly classes = computed(() => {
    const v = this.variant();
    let cls = '';

    if (v === 'keyword') {
      cls = 'px-2 py-0.5 bg-amber-500/10 text-amber-500/60 rounded-full font-mono text-xs';
    } else if (v === 'rating') {
      const color = RATING_COLORS[this.rating()] || 'text-chalk/30';
      cls = `font-mono text-xs ${color}`;
    } else {
      cls = 'px-2 py-0.5 bg-ink-700 text-chalk/40 rounded-full font-mono text-xs';
    }

    return `${cls} ${this.className()}`;
  });
}
