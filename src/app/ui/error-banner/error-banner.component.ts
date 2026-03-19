import { Component, input } from '@angular/core';

const VARIANTS: Record<string, string> = {
  error: 'bg-red-900/20 border-red-800 text-red-400',
  warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-400',
  info: 'bg-blue-900/20 border-blue-800 text-blue-400',
};

const ICONS: Record<string, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

@Component({
  selector: 'ui-error-banner',
  templateUrl: './error-banner.component.html',
})
export class ErrorBannerComponent {
  readonly message = input('');
  readonly variant = input<'error' | 'warning' | 'info'>('error');
  readonly showIcon = input(true);
  readonly className = input('');

  variantClass(): string {
    return VARIANTS[this.variant()] ?? VARIANTS['error'];
  }

  iconChar(): string {
    return ICONS[this.variant()] ?? ICONS['error'];
  }
}
