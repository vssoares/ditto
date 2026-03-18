/**
 * @file storage.js
 * @description Camada de abstração sobre o `localStorage` para persistência local dos dados do app.
 *
 * Todas as chaves do localStorage são prefixadas com `ditto_` para evitar colisões.
 *
 * @module utils/storage
 */
/** @typedef {import('./types').Phrase}     Phrase */
/** @typedef {import('./types').StudyStats} StudyStats */

/** Chaves do localStorage usadas pelo app. */
const KEYS = {
  API_KEY: 'ditto_api_key',
  PHRASES: 'ditto_phrases',
  STATS:   'ditto_stats',
}

export const storage = {
  // ── API Key ────────────────────────────────────────────────────────────────

  /** Retorna a OpenAI API Key salva, ou string vazia se não configurada. @returns {string} */
  getApiKey: () => localStorage.getItem(KEYS.API_KEY) || '',

  /** Salva a OpenAI API Key no localStorage. @param {string} key */
  setApiKey: (key) => localStorage.setItem(KEYS.API_KEY, key),

  // ── Frases ─────────────────────────────────────────────────────────────────

  /**
   * Retorna todas as frases salvas na biblioteca.
   * @returns {Phrase[]} Lista de frases (vazia se não houver nada salvo ou em caso de erro de parse).
   */
  getPhrases: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.PHRASES)) || []
    } catch {
      return []
    }
  },

  /**
   * Sobrescreve a lista completa de frases no localStorage.
   * @param {Phrase[]} phrases
   */
  setPhrases: (phrases) => localStorage.setItem(KEYS.PHRASES, JSON.stringify(phrases)),

  // ── Estatísticas ───────────────────────────────────────────────────────────

  /**
   * Retorna as estatísticas globais de estudo.
   * @returns {StudyStats}
   */
  getStats: () => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.STATS)) || { reviewed: 0, easy: 0, hard: 0 }
    } catch {
      return { reviewed: 0, easy: 0, hard: 0 }
    }
  },

  /**
   * Sobrescreve as estatísticas globais.
   * @param {StudyStats} stats
   */
  setStats: (stats) => localStorage.setItem(KEYS.STATS, JSON.stringify(stats)),

  /**
   * Incrementa os contadores de estatísticas após uma avaliação.
   * Sempre incrementa `reviewed`; incrementa `easy` ou `hard` conforme o tipo.
   *
   * @param {'easy' | 'hard'} type - Tipo de avaliação: `'easy'` para ok/easy, `'hard'` para hard/again.
   * @returns {StudyStats} Estatísticas atualizadas.
   */
  updateStats: (type) => {
    const stats = storage.getStats()
    stats.reviewed = (stats.reviewed || 0) + 1
    if (type === 'easy') stats.easy = (stats.easy || 0) + 1
    if (type === 'hard') stats.hard = (stats.hard || 0) + 1
    storage.setStats(stats)
    return stats
  },
}
