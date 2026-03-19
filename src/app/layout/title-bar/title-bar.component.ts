import { Component, inject } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { TooltipComponent } from '../../core/components/tooltip/tooltip.component';

@Component({
  selector: 'app-title-bar',
  imports: [TooltipComponent],
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent {
  readonly electron = inject(ElectronService);
  readonly version = '1.0.4';
}
