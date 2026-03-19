import { Component, input } from '@angular/core';

const SIZES: Record<string, string> = {
  sm: 'w-3 h-3 border-[1.5px]',
  md: 'w-4 h-4 border-2',
  lg: 'w-6 h-6 border-2',
};

@Component({
  selector: 'ui-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly className = input('');

  sizeClass(): string {
    return SIZES[this.size()] ?? SIZES['md'];
  }
}
