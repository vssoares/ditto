import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { TooltipComponent } from '../../core/components/tooltip/tooltip.component';
import { LayoutMenuService } from '../../services/layout-menu.service';
import packageJson from '../../../../package.json';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-title-bar',
  host: { class: 'sticky top-0 z-50 shrink-0' },
  imports: [TooltipComponent],
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent {
  readonly electron = inject(ElectronService);
  private readonly router = inject(Router);
  private readonly menu = inject(LayoutMenuService);
  readonly url = signal<string>(this.router.url);
  readonly showMobileMenuButton = computed(() =>
    this.url().includes('/app/') && !this.url().includes('/app/study')
  );
  readonly version = packageJson.version;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  toggleMobileMenu(): void {
    this.menu.toggleMobileMenu();
  }
}
