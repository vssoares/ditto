import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-stat-card',
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  readonly value = input<string | number>(0);
  readonly label = input('');
  readonly color = input('text-chalk');
  readonly className = input('');
}
