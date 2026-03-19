import { Component, inject, computed } from '@angular/core';
import { ElectronService, type UpdateState } from '../../services/electron.service';

@Component({
  selector: 'app-update-banner',
  templateUrl: './update-banner.component.html',
})
export class UpdateBannerComponent {
  readonly electron = inject(ElectronService);

  readonly state = this.electron.updateState;

  readonly visible = computed(() => {
    const s = this.state().status;
    return s === 'available' || s === 'downloading' || s === 'downloaded';
  });

  asAvailable(s: UpdateState): Extract<UpdateState, { status: 'available' }> {
    return s as Extract<UpdateState, { status: 'available' }>;
  }

  asDownloading(s: UpdateState): Extract<UpdateState, { status: 'downloading' }> {
    return s as Extract<UpdateState, { status: 'downloading' }>;
  }
}
