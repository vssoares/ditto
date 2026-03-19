import type { Routes } from '@angular/router';
import { requireAuthGuard, authRedirectGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/chrome/chrome.component').then((m) => m.ChromeComponent),
    children: [
      {
        path: 'login',
        canActivate: [authRedirectGuard],
        loadComponent: () =>
          import('./screens/login-screen/login-screen.component').then((m) => m.LoginScreenComponent),
      },
      {
        path: 'register',
        canActivate: [authRedirectGuard],
        loadComponent: () =>
          import('./screens/register-screen/register-screen.component').then((m) => m.RegisterScreenComponent),
      },
      {
        path: 'app',
        canActivate: [requireAuthGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
            children: [
              { path: 'generate', children: [] },
              { path: 'library', children: [] },
              { path: 'study', children: [] },
              { path: '', redirectTo: 'generate', pathMatch: 'full' },
            ],
          },
        ],
      },
      { path: '', redirectTo: 'app/generate', pathMatch: 'full' },
      { path: '**', redirectTo: 'app/generate' },
    ],
  },
];
