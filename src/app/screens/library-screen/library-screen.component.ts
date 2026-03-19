import { Component, inject, output, signal, computed } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterPillComponent, type FilterOption } from '../../ui/filter-pill/filter-pill.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { ErrorBannerComponent } from '../../ui/error-banner/error-banner.component';
import { PhrasesApiService } from '../../services/phrases-api.service';
import { StorageService } from '../../services/storage.service';
import type { Phrase } from '../../utils/types';

function formatNextReview(ts: number | undefined, now: number): string {
  if (!ts) return 'novo';
  const diff = ts - now;
  if (diff <= 0) return 'vencido';
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'hoje';
  if (days === 1) return 'amanhã';
  return `em ${days} dias`;
}

@Component({
  selector: 'app-library-screen',
  host: { class: 'flex flex-1 min-h-0 min-w-0' },
  imports: [
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    FilterPillComponent,
    EmptyStateComponent,
    SpinnerComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './library-screen.component.html',
})
export class LibraryScreenComponent {
  private readonly phrasesApi = inject(PhrasesApiService);
  private readonly storage = inject(StorageService);
  readonly study = output<Phrase[]>();

  readonly phrases = signal<Phrase[]>([]);
  readonly filter = signal<string>('all');
  readonly expandedId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  private readonly now = Date.now();

  readonly dueCount = computed(() =>
    this.phrases().filter((p) => !p.nextReview || p.nextReview <= this.now).length
  );

  readonly filterOptions = computed<FilterOption[]>(() => [
    { id: 'all', label: `Todas (${this.phrases().length})` },
    { id: 'due', label: `Revisar (${this.dueCount()})` },
    { id: 'learned', label: 'Aprendidas' },
  ]);

  readonly filtered = computed(() => {
    const f = this.filter();
    return this.phrases().filter((p) => {
      if (f === 'due') return !p.nextReview || p.nextReview <= this.now;
      if (f === 'learned') return !!(p.nextReview && p.nextReview > this.now && (p.repetitions ?? 0) >= 3);
      return true;
    });
  });

  constructor() {
    this.loadPhrases();
  }

  async loadPhrases(): Promise<void> {
    const token = this.storage.getAccessToken();
    if (!token) {
      this.error.set('Não autenticado.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set('');
    try {
      const [unreviewed, reviewed] = await Promise.all([
        this.phrasesApi.getUnreviewedPhrases(token),
        this.phrasesApi.getReviewedPhrases(token),
      ]);
      this.phrases.set([...unreviewed, ...reviewed]);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Erro inesperado.');
      this.phrases.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  studyDue(): void {
    this.study.emit(this.phrases().filter((p) => !p.nextReview || p.nextReview <= this.now));
  }

  formatReview(ts: number | undefined): string {
    return formatNextReview(ts, this.now);
  }
}
