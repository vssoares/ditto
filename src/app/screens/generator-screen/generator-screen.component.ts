import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../ui/label/label.component';
import { SelectOptionComponent } from '../../ui/select-option/select-option.component';
import { TextInputComponent } from '../../ui/text-input/text-input.component';
import { ErrorBannerComponent } from '../../ui/error-banner/error-banner.component';
import { PhrasesApiService } from '../../services/phrases-api.service';
import { StorageService } from '../../services/storage.service';
import { StudySessionService } from '../../services/study-session.service';
import type { Phrase } from '../../ui/utils/types';

const TOPICS = [
  { id: 'daily', label: 'Cotidiano', icon: '☀' },
  { id: 'work', label: 'Trabalho', icon: '💼' },
  { id: 'travel', label: 'Viagem', icon: '✈' },
  { id: 'food', label: 'Comida', icon: '🍽' },
  { id: 'tech', label: 'Tecnologia', icon: '💻' },
  { id: 'social', label: 'Social', icon: '💬' },
  { id: 'health', label: 'Saúde', icon: '🏃' },
  { id: 'academic', label: 'Acadêmico', icon: '📚' },
] as const;

const LEVELS = [
  { id: 'beginner', label: 'Iniciante', desc: 'A1 / A2' },
  { id: 'intermediate', label: 'Intermediário', desc: 'B1 / B2' },
  { id: 'advanced', label: 'Avançado', desc: 'C1 / C2' },
] as const;

const COUNTS = [5, 10, 15, 20] as const;

@Component({
  selector: 'app-generator-screen',
  host: { class: 'flex flex-1 min-h-0 min-w-0' },
  imports: [
    ButtonComponent,
    LabelComponent,
    SelectOptionComponent,
    TextInputComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './generator-screen.component.html',
})
export class GeneratorScreenComponent {
  private readonly phrasesApi = inject(PhrasesApiService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly session = inject(StudySessionService);

  readonly topics = TOPICS;
  readonly levels = LEVELS;
  readonly counts = COUNTS;

  readonly topic = signal<string>('daily');
  readonly customTopic = signal('');
  readonly level = signal<string>('beginner');
  readonly count = signal<number>(10);
  readonly loading = signal(false);
  readonly error = signal('');

  selectTopic(id: string): void {
    this.topic.set(id);
    this.customTopic.set('');
  }

  onCustomTopicChange(value: string): void {
    this.customTopic.set(value.slice(0, 50));
  }

  async handleGenerate(): Promise<void> {
    this.error.set('');
    this.loading.set(true);

    const topicLabel = this.customTopic().trim()
      ? this.customTopic().trim()
      : TOPICS.find((t) => t.id === this.topic())?.label ?? this.topic();

    try {
      const token = this.storage.getAccessToken();
      if (!token) throw new Error('Não autenticado.');

      const result = await this.phrasesApi.generatePhrases({
        topic: topicLabel,
        level: this.level(),
        count: this.count(),
        token,
      });
      this.session.setPhrases(result.phrases);
      this.router.navigate(['/app/study/unreviewed']);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      this.loading.set(false);
    }
  }
}
