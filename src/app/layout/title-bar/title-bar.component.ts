import { Component, inject } from '@angular/core';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent {
  readonly electron = inject(ElectronService);
  readonly version = '1.0.4';
}
