import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutMenuService {
  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}

