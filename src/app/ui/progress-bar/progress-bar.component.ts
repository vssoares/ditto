import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent {
  readonly value = input(0);
  readonly max = input(100);
  readonly className = input('');

  readonly pct = computed(() =>
    Math.min(100, Math.max(0, (this.value() / this.max()) * 100))
  );
}
