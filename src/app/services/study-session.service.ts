import { Injectable, signal } from '@angular/core';
import type { Phrase } from '../ui/utils/types';

@Injectable({ providedIn: 'root' })
export class StudySessionService {
  private readonly phrases = signal<Phrase[] | null>(null);

  setPhrases(next: Phrase[]): void {
    this.phrases.set(next);
  }

  clear(): void {
    this.phrases.set(null);
  }

  getPhrases(): Phrase[] | null {
    return this.phrases();
  }

  phrasesSignal() {
    return this.phrases;
  }
}

