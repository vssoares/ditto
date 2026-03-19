import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from '../title-bar/title-bar.component';
import { UpdateBannerComponent } from '../update-banner/update-banner.component';

@Component({
  selector: 'app-chrome',
  host: { class: 'contents' },
  imports: [RouterOutlet, TitleBarComponent, UpdateBannerComponent],
  templateUrl: './chrome.component.html',
})
export class ChromeComponent {
  readonly grainBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;
}
