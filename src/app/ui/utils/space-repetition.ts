import type { Phrase, Rating } from './types';

export function updatePhrase(phrase: Phrase, rating: Rating): Phrase {
  const now = Date.now();
  const ease = phrase.ease ?? 2.5;
  const interval = phrase.interval ?? 1;
  const repetitions = phrase.repetitions ?? 0;

  let newEase = ease;
  let newInterval = interval;
  let newRepetitions = repetitions;

  switch (rating) {
    case 'again':
      newRepetitions = 0;
      newInterval = 1;
      newEase = Math.max(1.3, ease - 0.2);
      break;
    case 'hard':
      newRepetitions = repetitions + 1;
      newInterval = Math.max(1, Math.round(interval * 1.2));
      newEase = Math.max(1.3, ease - 0.15);
      break;
    case 'ok':
      newRepetitions = repetitions + 1;
      newInterval = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.round(interval * ease);
      break;
    case 'easy':
      newRepetitions = repetitions + 1;
      newInterval = repetitions === 0 ? 4 : Math.round(interval * ease * 1.3);
      newEase = ease + 0.1;
      break;
  }

  return {
    ...phrase,
    ease: newEase,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: now + newInterval * 24 * 60 * 60 * 1000,
    lastReview: now,
    rating,
  };
}

export function getDueCount(phrases: Phrase[]): number {
  const now = Date.now();
  // Na sessão de "Revisar", entram:
  // - unreviewed (sem lastReview)
  // - reviewed apenas quando vencidas (nextReview <= agora)
  return phrases.filter((p) => {
    if (p.lastReview === undefined) return true; // unreviewed
    return p.nextReview !== undefined && p.nextReview <= now; // reviewed due
  }).length;
}

export function sortByDue(phrases: Phrase[]): Phrase[] {
  const now = Date.now();
  return [...phrases].sort((a, b) => {
    const aUnreviewed = a.lastReview === undefined;
    const bUnreviewed = b.lastReview === undefined;

    // Unreviewed primeiro.
    if (aUnreviewed && !bUnreviewed) return -1;
    if (!aUnreviewed && bUnreviewed) return 1;

    const aDue = !aUnreviewed && a.nextReview !== undefined && a.nextReview <= now;
    const bDue = !bUnreviewed && b.nextReview !== undefined && b.nextReview <= now;

    // Depois, vencidas (se existirem) em ordem de nextReview.
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    const aValue = a.nextReview ?? Number.POSITIVE_INFINITY;
    const bValue = b.nextReview ?? Number.POSITIVE_INFINITY;
    return aValue - bValue;
  });
}
