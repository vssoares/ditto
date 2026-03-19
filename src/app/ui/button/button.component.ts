import { Component, input, output } from '@angular/core';

const VARIANTS: Record<string, string> = {
  primary:
    'bg-amber-500 hover:bg-amber-400 text-ink-950 font-semibold disabled:opacity-30',
  secondary:
    'border border-ink-600 bg-ink-800 hover:border-ink-500 text-chalk/60 hover:text-chalk/90',
  ghost:
    'text-chalk/30 hover:text-chalk/70',
  danger:
    'border border-red-800 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300',
};

const SIZES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly variant = input<string>('primary');
  readonly size = input<string>('md');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly className = input('');
  readonly clicked = output<void>();

  classes(): string {
    return [
      'font-sans transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer',
      VARIANTS[this.variant()] ?? VARIANTS['primary'],
      SIZES[this.size()] ?? SIZES['md'],
      this.fullWidth() ? 'w-full' : '',
      this.className(),
    ].filter(Boolean).join(' ');
  }
}
