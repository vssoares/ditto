import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
})
export class SelectOptionComponent {
  readonly isSelected = input(false);
  readonly layout = input<'card' | 'pill'>('pill');
  readonly icon = input('');
  readonly label = input('');
  readonly sublabel = input('');
  readonly className = input('');
  readonly selected = output<void>();
  readonly fullWidth = input(false);

  baseClasses(): string {
    const active = 'border-amber-500 bg-amber-500/10 text-amber-400';
    const inactive = 'border-ink-600 bg-ink-800 text-chalk/50 hover:border-ink-500 hover:text-chalk/70';
    return `border transition-all duration-150 cursor-pointer font-sans text-sm ${this.fullWidth() ? 'w-full' : ''} ${this.isSelected() ? active : inactive}`;
  }
}
