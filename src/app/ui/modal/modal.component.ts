import { Component, input, output, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const WIDTHS: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

@Component({
  selector: 'ui-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  private readonly doc = inject(DOCUMENT);

  readonly open = input(false);
  readonly title = input('');
  readonly maxWidth = input('md');
  readonly showClose = input(true);
  readonly closed = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (!this.open()) return;

      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.closed.emit();
      };
      this.doc.defaultView?.addEventListener('keydown', handler);
      onCleanup(() => this.doc.defaultView?.removeEventListener('keydown', handler));
    });
  }

  widthClass(): string {
    return WIDTHS[this.maxWidth()] ?? WIDTHS['md'];
  }
}
