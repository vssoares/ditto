/**
 * @file storage.ts
 * @description Camada de abstração sobre o `localStorage` para persistência local dos dados do app.
 *
 * Todas as chaves do localStorage são prefixadas com `ditto_` para evitar colisões.
 *
 * @module utils/storage
 */

import type { Phrase, StudyStats } from './types'

/** Chaves do localStorage usadas pelo app. */
const KEYS = {
  PHRASES: 'ditto_phrases',
  STATS: 'ditto_stats',
  API_KEY: 'ditto_api_key',
  AUTH_ACCESS_TOKEN: 'ditto_access_token',
  AUTH_USER: 'ditto_auth_user',
} as const

const defaultStats: StudyStats = { reviewed: 0, easy: 0, hard: 0 }

export const storage = {
  // ── Frases ─────────────────────────────────────────────────────────────────

  /**
   * Retorna todas as frases salvas na biblioteca.
   * Lista vazia se não houver nada salvo ou em caso de erro de parse.
   */
  getPhrases: (): Phrase[] => {
    try {
      return (JSON.parse(localStorage.getItem(KEYS.PHRASES) ?? 'null') as Phrase[] | null) ?? []
    } catch {
      return []
    }
  },

  /**
   * Sobrescreve a lista completa de frases no localStorage.
   */
  setPhrases: (phrases: Phrase[]): void =>
    localStorage.setItem(KEYS.PHRASES, JSON.stringify(phrases)),

  // ── Estatísticas ───────────────────────────────────────────────────────────

  /**
   * Retorna as estatísticas globais de estudo.
   */
  getStats: (): StudyStats => {
    try {
      return (
        (JSON.parse(localStorage.getItem(KEYS.STATS) ?? 'null') as StudyStats | null) ??
        defaultStats
      )
    } catch {
      return defaultStats
    }
  },

  /**
   * Sobrescreve as estatísticas globais.
   */
  setStats: (stats: StudyStats): void => localStorage.setItem(KEYS.STATS, JSON.stringify(stats)),

  /**
   * Incrementa os contadores de estatísticas após uma avaliação.
   * Sempre incrementa `reviewed`; incrementa `easy` ou `hard` conforme o tipo.
   *
   * @param type - Tipo de avaliação: `'easy'` para ok/easy, `'hard'` para hard/again.
   * @returns Estatísticas atualizadas.
   */
  updateStats: (type: 'easy' | 'hard'): StudyStats => {
    const stats = storage.getStats()
    stats.reviewed = (stats.reviewed || 0) + 1
    if (type === 'easy') stats.easy = (stats.easy || 0) + 1
    if (type === 'hard') stats.hard = (stats.hard || 0) + 1
    storage.setStats(stats)
    return stats
  },

  // ── API Key ────────────────────────────────────────────────────────────────

  getApiKey: (): string =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(KEYS.API_KEY) ?? '' : '',
  setApiKey: (key: string): void => localStorage.setItem(KEYS.API_KEY, key),

  // ── Auth (local) ───────────────────────────────────────────────────────────

  getAccessToken: (): string => localStorage.getItem(KEYS.AUTH_ACCESS_TOKEN) ?? '',
  isAuthenticated: (): boolean => Boolean(storage.getAccessToken()),

  getAuthUser: (): { id: string; email: string } | null => {
    try {
      return (
        (JSON.parse(localStorage.getItem(KEYS.AUTH_USER) ?? 'null') as
          | { id: string; email: string }
          | null) ?? null
      )
    } catch {
      return null
    }
  },

  logout: (): void => {
    localStorage.removeItem(KEYS.AUTH_ACCESS_TOKEN)
    localStorage.removeItem(KEYS.AUTH_USER)
  },

  setSession: (token: string, user: { id: string; email: string }): void => {
    localStorage.setItem(KEYS.AUTH_ACCESS_TOKEN, token)
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user))
  },

  // compat: tela antiga podia prefiller email
  getAuthEmail: (): string => storage.getAuthUser()?.email ?? '',
}
