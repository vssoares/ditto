import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';
import { StudyScreenComponent } from '../study-screen/study-screen.component';
import type { Phrase } from '../../ui/utils/types';
import { StudySessionService } from '../../services/study-session.service';

@Component({
  selector: 'app-study-unreviewed',
  host: { class: 'flex flex-1 min-h-0 min-w-0' },
  imports: [StudyScreenComponent, ButtonComponent, EmptyStateComponent],
  templateUrl: './study-unreviewed.component.html',
})
export class StudyUnreviewedComponent {
  private readonly router = inject(Router);
  private readonly session = inject(StudySessionService);

  readonly initialPhrases = computed<Phrase[]>(() => {
    const all = this.session.getPhrases();
    if (!all) return [];
    return all.filter((p) => p.lastReview === undefined);
  });

  constructor() {
    effect(() => {
      if (this.session.getPhrases() === null) this.router.navigate(['/app/library/unreviewed']);
    });
  }

  handleBack(): void {
    this.session.clear();
    this.router.navigate(['/app/library/unreviewed']);
  }

  handleFinish(): void {
    this.session.clear();
    // Após revisar unreviewed, as frases viram "reviewed"
    this.router.navigate(['/app/library/reviewed']);
  }

  handleGenerate(): void {
    this.session.clear();
    this.router.navigate(['/app/generate']);
  }
}

