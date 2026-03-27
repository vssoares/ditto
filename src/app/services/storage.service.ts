import { Injectable, signal } from '@angular/core';
import type { Phrase, Rating, StudyStats } from '../ui/utils/types';

const KEYS = {
  PHRASES: 'ditto_phrases',
  STATS: 'ditto_stats',
  API_KEY: 'ditto_api_key',
  AUTH_ACCESS_TOKEN: 'ditto_access_token',
  AUTH_USER: 'ditto_auth_user',
} as const;

const RATING_POINTS: Record<Rating, number> = { again: 0, hard: 5, ok: 10, easy: 15 };

const defaultStats: StudyStats = { reviewed: 0, easy: 0, hard: 0, score: 0 };

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _score = signal(this.getStats().score);
  readonly score = this._score.asReadonly();

  getPhrases(): Phrase[] {
    try {
      return (JSON.parse(localStorage.getItem(KEYS.PHRASES) ?? 'null') as Phrase[] | null) ?? [];
    } catch {
      return [];
    }
  }

  setPhrases(phrases: Phrase[]): void {
    localStorage.setItem(KEYS.PHRASES, JSON.stringify(phrases));
  }

  getStats(): StudyStats {
    try {
      return (
        (JSON.parse(localStorage.getItem(KEYS.STATS) ?? 'null') as StudyStats | null) ??
        defaultStats
      );
    } catch {
      return defaultStats;
    }
  }

  setStats(stats: StudyStats): void {
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  }

  updateStats(rating: Rating): StudyStats {
    const stats = this.getStats();
    stats.reviewed = (stats.reviewed || 0) + 1;
    if (rating === 'easy') stats.easy = (stats.easy || 0) + 1;
    if (rating === 'hard') stats.hard = (stats.hard || 0) + 1;
    stats.score = (stats.score || 0) + RATING_POINTS[rating];
    this.setStats(stats);
    this._score.set(stats.score);
    return stats;
  }

  getApiKey(): string {
    return localStorage.getItem(KEYS.API_KEY) ?? '';
  }

  setApiKey(key: string): void {
    localStorage.setItem(KEYS.API_KEY, key);
  }

  getAccessToken(): string {
    return localStorage.getItem(KEYS.AUTH_ACCESS_TOKEN) ?? '';
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }

  getAuthUser(): { id: string; email: string } | null {
    try {
      return (
        (JSON.parse(localStorage.getItem(KEYS.AUTH_USER) ?? 'null') as
          | { id: string; email: string }
          | null) ?? null
      );
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(KEYS.AUTH_ACCESS_TOKEN);
    localStorage.removeItem(KEYS.AUTH_USER);
  }

  setSession(token: string, user: { id: string; email: string }): void {
    localStorage.setItem(KEYS.AUTH_ACCESS_TOKEN, token);
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
  }

  getAuthEmail(): string {
    return this.getAuthUser()?.email ?? '';
  }
}
