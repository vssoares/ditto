import { Injectable } from '@angular/core';
import type { Phrase, StudyStats } from '../ui/utils/types';

const KEYS = {
  PHRASES: 'ditto_phrases',
  STATS: 'ditto_stats',
  API_KEY: 'ditto_api_key',
  AUTH_ACCESS_TOKEN: 'ditto_access_token',
  AUTH_USER: 'ditto_auth_user',
} as const;

const defaultStats: StudyStats = { reviewed: 0, easy: 0, hard: 0 };

@Injectable({ providedIn: 'root' })
export class StorageService {
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

  updateStats(type: 'easy' | 'hard'): StudyStats {
    const stats = this.getStats();
    stats.reviewed = (stats.reviewed || 0) + 1;
    if (type === 'easy') stats.easy = (stats.easy || 0) + 1;
    if (type === 'hard') stats.hard = (stats.hard || 0) + 1;
    this.setStats(stats);
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
