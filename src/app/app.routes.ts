import type { Routes } from '@angular/router';
import { requireAuthGuard, authRedirectGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/chrome/chrome.component').then((m) => m.ChromeComponent),
    children: [
      {
        path: 'login',
        title: 'Entrar no Ditto',
        canActivate: [authRedirectGuard],
        loadComponent: () =>
          import('./core/auth/login-screen/login-screen.component').then((m) => m.LoginScreenComponent),
      },
      {
        path: 'register',
        title: 'Criar conta no Ditto',
        canActivate: [authRedirectGuard],
        loadComponent: () =>
          import('./core/auth/register-screen/register-screen.component').then((m) => m.RegisterScreenComponent),
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
              {
                path: 'generate',
                title: 'Gerar frases',
                loadComponent: () =>
                  import('./screens/generator-screen/generator-screen.component').then(
                    (m) => m.GeneratorScreenComponent,
                  ),
              },
              {
                path: 'library',
                title: 'Biblioteca',
                loadComponent: () =>
                  import('./screens/library-screen/library-screen.component').then((m) => m.LibraryScreenComponent),
              },
              {
                path: 'study/unreviewed',
                title: 'Revisar frases novas',
                loadComponent: () =>
                  import('./screens/study-unreviewed/study-unreviewed.component').then((m) => m.StudyUnreviewedComponent),
              },
              {
                path: 'study/reviewed',
                title: 'Revisar frases vencidas',
                loadComponent: () =>
                  import('./screens/study-reviewed/study-reviewed.component').then((m) => m.StudyReviewedComponent),
              },
              { path: 'study', redirectTo: 'study/unreviewed', pathMatch: 'full' },
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
