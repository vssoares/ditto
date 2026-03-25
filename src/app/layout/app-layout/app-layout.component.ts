import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';
import { TooltipComponent } from '../../core/components/tooltip/tooltip.component';
import { LayoutMenuService } from '../../services/layout-menu.service';

const NAV = [
  { id: 'generate', label: 'Gerar', icon: '✦', path: '/app/generate' },
  { id: 'library', label: 'Biblioteca', icon: '◈', path: '/app/library' },
] as const;

@Component({
  selector: 'app-layout',
  host: { class: 'flex flex-1' },
  imports: [RouterOutlet, TooltipComponent],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly menu = inject(LayoutMenuService);

  readonly nav = NAV;
  readonly url = signal<string>(this.router.url);
  readonly isStudyRoute = computed(() => this.url().includes('/app/study'));
  readonly mobileMenuOpen = this.menu.mobileMenuOpen;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.menu.closeMobileMenu();
  }

  isActive(path: string): boolean {
    return this.url().includes(path);
  }

  handleLogout(): void {
    this.storage.logout();
    this.menu.closeMobileMenu();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  closeMobileMenu(): void {
    this.menu.closeMobileMenu();
  }
}
