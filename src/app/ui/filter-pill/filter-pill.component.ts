import { Component, input, output } from '@angular/core';

export interface FilterOption {
  id: string;
  label: string;
}

@Component({
  selector: 'ui-filter-pill',
  templateUrl: './filter-pill.component.html',
})
export class FilterPillComponent {
  readonly options = input<FilterOption[]>([]);
  readonly value = input('');
  readonly className = input('');
  readonly changed = output<string>();
}
