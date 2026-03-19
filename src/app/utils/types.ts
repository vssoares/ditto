export interface Phrase {
  english: string;
  portuguese: string;
  tip?: string;
  keywords?: string[];
  id: string;
  ease?: number;
  interval?: number;
  repetitions?: number;
  nextReview?: number;
  lastReview?: number;
  rating?: Rating;
}

export type Rating = 'again' | 'hard' | 'ok' | 'easy';

export interface StudyStats {
  reviewed: number;
  easy: number;
  hard: number;
}
