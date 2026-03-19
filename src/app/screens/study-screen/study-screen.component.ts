import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ProgressBarComponent } from '../../ui/progress-bar/progress-bar.component';
import { StatCardComponent } from '../../ui/stat-card/stat-card.component';
import { ErrorBannerComponent } from '../../ui/error-banner/error-banner.component';
import { PhrasesApiService } from '../../services/phrases-api.service';
import { StorageService } from '../../services/storage.service';
import { sortByDue } from '../../ui/utils/space-repetition';
import type { Phrase, Rating } from '../../ui/utils/types';

interface SessionStats {
  easy: number;
  ok: number;
  hard: number;
  again: number;
}

const RATING_BUTTONS: { id: Rating; label: string; key: string; hoverClass: string }[] = [
  { id: 'again', label: 'De novo', key: '1', hoverClass: 'hover:bg-red-900/40 hover:border-red-700 hover:text-red-400' },
  { id: 'hard', label: 'Difícil', key: '2', hoverClass: 'hover:bg-orange-900/40 hover:border-orange-700 hover:text-orange-400' },
  { id: 'ok', label: 'Ok', key: '3', hoverClass: 'hover:bg-blue-900/40 hover:border-blue-700 hover:text-blue-400' },
  { id: 'easy', label: 'Fácil', key: '4', hoverClass: 'hover:bg-green-900/40 hover:border-green-700 hover:text-green-400' },
];

@Component({
  selector: 'app-study-screen',
  host: { class: 'flex flex-1 min-h-0 min-w-0' },
  imports: [
    ButtonComponent,
    BadgeComponent,
    ProgressBarComponent,
    StatCardComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './study-screen.component.html',
})
export class StudyScreenComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly phrasesApi = inject(PhrasesApiService);
  private readonly storage = inject(StorageService);

  readonly initialPhrases = input.required<Phrase[]>();
  readonly back = output<void>();
  readonly finish = output<void>();

  readonly ratingButtons = RATING_BUTTONS;

  readonly phrases = signal<Phrase[]>([]);
  readonly index = signal(0);
  readonly flipped = signal(false);
  readonly done = signal(false);
  readonly sessionStats = signal<SessionStats>({ easy: 0, ok: 0, hard: 0, again: 0 });
  readonly error = signal('');
  readonly submitting = signal(false);

  readonly current = computed<Phrase | null>(() => this.phrases()[this.index()] ?? null);

  readonly finishScore = computed(() => {
    const s = this.sessionStats();
    const total = this.phrases().length;
    return total > 0 ? Math.round(((s.easy + s.ok) / total) * 100) : 0;
  });

  readonly finishEmoji = computed(() => {
    const score = this.finishScore();
    return score >= 80 ? '🎉' : score >= 50 ? '💪' : '📖';
  });

  readonly finishTitle = computed(() => {
    const score = this.finishScore();
    return score >= 80 ? 'Excelente!' : score >= 50 ? 'Bom trabalho!' : 'Continue praticando!';
  });

  constructor() {
    effect(() => {
      const ip = this.initialPhrases();
      if (ip.length > 0) {
        this.phrases.set(sortByDue(ip));
      }
    });

    effect((onCleanup) => {
      const handler = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          this.handleFlip();
        }
        if (this.flipped()) {
          if (this.submitting()) return;
          if (e.code === 'Digit1') this.handleRating('again');
          if (e.code === 'Digit2') this.handleRating('hard');
          if (e.code === 'Digit3') this.handleRating('ok');
          if (e.code === 'Digit4') this.handleRating('easy');
        }
      };
      this.doc.defaultView?.addEventListener('keydown', handler);
      onCleanup(() => this.doc.defaultView?.removeEventListener('keydown', handler));
    });
  }

  handleFlip(): void {
    if (!this.flipped()) this.flipped.set(true);
  }

  async handleRating(rating: Rating): Promise<void> {
    if (!this.flipped() || !this.current()) return;
    if (this.submitting()) return;

    const token = this.storage.getAccessToken();
    if (!token) {
      this.error.set('Não autenticado.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    debugger
    try {
      await this.phrasesApi.reviewPhrase({
        token,
        phraseId: this.current()?.phraseId ?? '',
        rating,
      });
      this.sessionStats.update((s) => ({ ...s, [rating]: s[rating] + 1 }));
      this.flipped.set(false);

      if (this.index() + 1 >= this.phrases().length) {
        this.done.set(true);
      } else {
        this.index.update((i) => i + 1);
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      this.submitting.set(false);
    }
  }
}
