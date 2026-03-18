/**
 * @file spaceRepetition.js
 * @description Implementação do algoritmo SM-2 (SuperMemo 2) para repetição espaçada.
 * Calcula o próximo intervalo de revisão com base no desempenho do usuário.
 *
 * @module utils/spaceRepetition
 */
/** @typedef {import('./types').Phrase} Phrase */
/** @typedef {import('./types').Rating} Rating */
/**
 * Atualiza os metadados SM-2 de uma frase com base na avaliação do usuário.
 *
 * @param {Phrase} phrase  - Frase a atualizar.
 * @param {Rating} rating  - Avaliação do usuário.
 * @returns {Phrase}       - Nova frase com `interval`, `ease`, `repetitions` e `nextReview` atualizados.
 */
export function updatePhrase(phrase, rating) {
  const now = Date.now()
  const ease = phrase.ease ?? 2.5
  const interval = phrase.interval ?? 1
  const repetitions = phrase.repetitions ?? 0

  let newEase = ease
  let newInterval = interval
  let newRepetitions = repetitions

  switch (rating) {
    case 'again':
      newRepetitions = 0
      newInterval = 1
      newEase = Math.max(1.3, ease - 0.2)
      break
    case 'hard':
      newRepetitions = repetitions + 1
      newInterval = Math.max(1, Math.round(interval * 1.2))
      newEase = Math.max(1.3, ease - 0.15)
      break
    case 'ok':
      newRepetitions = repetitions + 1
      newInterval = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.round(interval * ease)
      break
    case 'easy':
      newRepetitions = repetitions + 1
      newInterval = repetitions === 0 ? 4 : Math.round(interval * ease * 1.3)
      newEase = ease + 0.1
      break
  }

  return {
    ...phrase,
    ease: newEase,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: now + newInterval * 24 * 60 * 60 * 1000,
    lastReview: now,
    rating,
  }
}

/**
 * Retorna a quantidade de frases com revisão vencida (ou nunca revisadas).
 *
 * @param {Phrase[]} phrases - Lista de frases.
 * @returns {number}
 */
export function getDueCount(phrases) {
  const now = Date.now()
  return phrases.filter((p) => !p.nextReview || p.nextReview <= now).length
}

/**
 * Ordena frases priorizando as com revisão vencida, depois por data de vencimento crescente.
 *
 * @param {Phrase[]} phrases - Lista de frases a ordenar.
 * @returns {Phrase[]}       - Nova lista ordenada (não muta o original).
 */
export function sortByDue(phrases) {
  const now = Date.now()
  return [...phrases].sort((a, b) => {
    const aOverdue = !a.nextReview || a.nextReview <= now
    const bOverdue = !b.nextReview || b.nextReview <= now
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    return (a.nextReview ?? 0) - (b.nextReview ?? 0)
  })
}
