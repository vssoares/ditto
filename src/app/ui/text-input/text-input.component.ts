import { Component, input, output, signal } from '@angular/core';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'ui-text-input',
  imports: [LabelComponent],
  templateUrl: './text-input.component.html',
})
export class TextInputComponent {
  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly placeholder = input('');
  readonly value = input('');
  readonly type = input<'text' | 'password' | 'email'>('text');
  readonly disabled = input(false);
  readonly className = input('');
  readonly valueChange = output<string>();

  readonly showPassword = signal(false);

  isPassword(): boolean {
    return this.type() === 'password';
  }

  inputType(): string {
    if (this.isPassword()) {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  }

  inputClasses(): string {
    return [
      'w-full bg-ink-900 border rounded-xl px-4 py-3 text-chalk font-mono text-sm outline-none transition-colors',
      this.isPassword() ? 'pr-14' : '',
      this.error()
        ? 'border-red-700 focus:border-red-500'
        : 'border-ink-600 focus:border-amber-500',
      this.disabled() ? 'opacity-40 cursor-not-allowed' : '',
    ].filter(Boolean).join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
