import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter as rxFilter } from 'rxjs/operators';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterPillComponent, type FilterOption } from '../../ui/filter-pill/filter-pill.component';
import { EmptyStateComponent } from '../../ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { ErrorBannerComponent } from '../../ui/error-banner/error-banner.component';
import { PhrasesApiService } from '../../services/phrases-api.service';
import { StorageService } from '../../services/storage.service';
import { StudySessionService } from '../../services/study-session.service';
import type { Phrase } from '../../ui/utils/types';

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
  private readonly router = inject(Router);
  private readonly session = inject(StudySessionService);

  readonly phrases = signal<Phrase[]>([]);
  readonly unreviewedPhrases = signal<Phrase[]>([]);
  readonly reviewedPhrases = signal<Phrase[]>([]);
  readonly filter = signal<'unreviewed' | 'reviewed'>('unreviewed');
  readonly expandedId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  private readonly now = Date.now();

  private readonly isUnreviewed = (p: Phrase): boolean =>
    p.lastReview === undefined;

  private readonly isDueReviewed = (p: Phrase): boolean =>
    p.lastReview !== undefined && p.nextReview !== undefined && p.nextReview <= this.now;

  readonly unreviewedCount = computed(() => this.unreviewedPhrases().length);
  readonly reviewedCount = computed(() => this.reviewedPhrases().length);
  readonly dueReviewedCount = computed(() => this.reviewedPhrases().filter(this.isDueReviewed).length);

  readonly filterOptions = computed<FilterOption[]>(() => [
    { id: 'unreviewed', label: `Não revisadas (${this.unreviewedCount()})` },
    { id: 'reviewed', label: `Revisadas (${this.reviewedCount()})` },
  ]);

  readonly filtered = computed(() => {
    const f = this.filter();
    if (f === 'unreviewed') return this.unreviewedPhrases();
    return this.reviewedPhrases();
  });

  constructor() {
    this.syncFilterFromUrl(this.router.url);
    this.router.events
      .pipe(rxFilter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncFilterFromUrl(e.urlAfterRedirects));
    this.loadPhrases();
  }

  private syncFilterFromUrl(url: string): void {
    if (url.includes('/app/library/reviewed')) this.filter.set('reviewed');
    else if (url.includes('/app/library/unreviewed')) this.filter.set('unreviewed');
  }

  onTabChanged(tab: string): void {
    if (tab === 'unreviewed') {
      this.filter.set('unreviewed');
    }

    if (tab === 'reviewed') {
      this.filter.set('reviewed');
    }
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
      this.unreviewedPhrases.set(unreviewed);
      this.reviewedPhrases.set(reviewed);
      this.phrases.set([...unreviewed, ...reviewed]);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Erro inesperado.');
      this.phrases.set([]);
      this.unreviewedPhrases.set([]);
      this.reviewedPhrases.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  studyUnreviewedNow(): void {
    this.session.setPhrases(this.unreviewedPhrases());
    this.router.navigate(['/app/study/unreviewed']);
  }

  studyReviewedNow(): void {
    this.session.setPhrases(this.reviewedPhrases().filter(this.isDueReviewed));
    this.router.navigate(['/app/study/reviewed']);
  }

  formatReview(ts: number | undefined): string {
    return formatNextReview(ts, this.now);
  }
}
