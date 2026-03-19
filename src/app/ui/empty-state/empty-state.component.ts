import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-empty-state',
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly icon = input('📭');
  readonly title = input('');
  readonly description = input('');
  readonly className = input('');
}
