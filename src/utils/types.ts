/**
 * @file types.ts
 * @description Definições de tipos compartilhados por todo o projeto.
 *
 * @module utils/types
 */

/**
 * Representa uma frase gerada pela OpenAI, enriquecida com metadados de repetição espaçada.
 *
 * — Campos gerados pela OpenAI:
 * — Campos adicionados pelo app:
 * — Campos do algoritmo SM-2 (repetição espaçada):
 */
export interface Phrase {
  /** Frase em inglês. */
  english: string
  /** Tradução em português brasileiro. */
  portuguese: string
  /** Dica de gramática ou vocabulário. */
  tip?: string
  /** Palavras-chave da frase (2–3 itens). */
  keywords?: string[]
  /** ID único gerado em `Date.now() + índice`. */
  id: string
  /** Fator de facilidade (padrão: 2.5, mínimo: 1.3). */
  ease?: number
  /** Intervalo atual em dias até a próxima revisão. */
  interval?: number
  /** Quantas vezes a frase foi revisada com sucesso. */
  repetitions?: number
  /** Timestamp (ms) da próxima revisão agendada. */
  nextReview?: number
  /** Timestamp (ms) da última revisão feita. */
  lastReview?: number
  /** Último resultado de avaliação do usuário. */
  rating?: Rating
}

/**
 * Avaliação do usuário para uma frase durante a sessão de estudo.
 *
 * - **again** → Não lembrei. Reinicia o intervalo.
 * - **hard**  → Custou lembrar. Aumenta levemente o intervalo.
 * - **ok**    → Lembrei com esforço. Progressão normal SM-2.
 * - **easy**  → Lembrei facilmente. Aumenta intervalo e ease factor.
 */
export type Rating = 'again' | 'hard' | 'ok' | 'easy'

/**
 * Estatísticas globais de estudo armazenadas no localStorage.
 */
export interface StudyStats {
  /** Total de frases revisadas (todas as sessões). */
  reviewed: number
  /** Total de avaliações "easy" ou "ok". */
  easy: number
  /** Total de avaliações "hard" ou "again". */
  hard: number
}
