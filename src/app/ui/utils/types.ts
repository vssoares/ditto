export interface Phrase {
  id: string;
  english: string;
  portuguese: string;
  tip?: string;
  keywords?: string[];
  ease?: number;
  interval?: number;
  repetitions?: number;
  nextReview?: number;
  lastReview?: number;
  rating?: Rating;
  phraseId?: string;
}

export type Rating = 'again' | 'hard' | 'ok' | 'easy';

export interface StudyStats {
  reviewed: number;
  easy: number;
  hard: number;
  score: number;
}
