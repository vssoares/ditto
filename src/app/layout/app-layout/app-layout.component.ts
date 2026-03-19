import { Component, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GeneratorScreenComponent } from '../../screens/generator-screen/generator-screen.component';
import { LibraryScreenComponent } from '../../screens/library-screen/library-screen.component';
import { StudyScreenComponent } from '../../screens/study-screen/study-screen.component';
import type { Phrase } from '../../utils/types';

const NAV = [
  { id: 'generate', label: 'Gerar', icon: '✦', path: '/app/generate' },
  { id: 'library', label: 'Biblioteca', icon: '◈', path: '/app/library' },
] as const;

@Component({
  selector: 'app-layout',
  host: { class: 'flex flex-1 min-h-0' },
  imports: [
    GeneratorScreenComponent,
    LibraryScreenComponent,
    StudyScreenComponent,
  ],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
  private readonly router = inject(Router);

  readonly nav = NAV;
  readonly screen = signal<string>('generate');
  readonly studyPhrases = signal<Phrase[] | null>(null);

  constructor() {
    this.syncScreenFromUrl(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncScreenFromUrl(e.urlAfterRedirects));
  }

  private syncScreenFromUrl(url: string): void {
    if (url.includes('/app/library')) this.screen.set('library');
    else if (url.includes('/app/study')) this.screen.set('study');
    else this.screen.set('generate');
  }

  navigateTo(path: string, id: string): void {
    this.screen.set(id);
    this.router.navigate([path]);
  }

  handleGenerate(phrases: Phrase[]): void {
    this.studyPhrases.set(phrases);
    this.screen.set('study');
    this.router.navigate(['/app/study']);
  }

  handleStudyFromLibrary(phrases: Phrase[]): void {
    this.studyPhrases.set(phrases);
    this.screen.set('study');
    this.router.navigate(['/app/study']);
  }

  handleStudyBack(): void {
    this.studyPhrases.set(null);
    this.screen.set('generate');
    this.router.navigate(['/app/generate']);
  }

  handleStudyFinish(): void {
    this.studyPhrases.set(null);
    this.screen.set('library');
    this.router.navigate(['/app/library']);
  }
}
