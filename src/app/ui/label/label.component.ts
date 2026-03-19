import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-label',
  templateUrl: './label.component.html',
})
export class LabelComponent {
  readonly className = input('');
}
