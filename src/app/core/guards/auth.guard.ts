import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { StorageService } from '../../services/storage.service';

export const requireAuthGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const authRedirectGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.isAuthenticated()) {
    return router.createUrlTree(['/app/generate']);
  }

  return true;
};
