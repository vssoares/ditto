import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  private readonly electron = inject(ElectronService);

  constructor() {
    this.electron.initUpdateListeners();
  }
}
