import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StorageService } from './storage.service'

const KEYS = {
  PHRASES: 'ditto_phrases',
  STATS: 'ditto_stats',
  API_KEY: 'ditto_api_key',
  AUTH_ACCESS_TOKEN: 'ditto_access_token',
  AUTH_USER: 'ditto_auth_user',
}

describe('StorageService', () => {
  let service: StorageService

  beforeEach(() => {
    localStorage.clear()
    service = new StorageService()
    // Seed localStorage so getStats() reads a fresh object instead of mutating the
    // shared `defaultStats` module constant (production-code mutation issue).
    service.setStats({ reviewed: 0, easy: 0, hard: 0 })
  })

  // -------------------------------------------------------------------------
  // Phrases
  // -------------------------------------------------------------------------

  describe('getPhrases / setPhrases', () => {
    it('retorna [] quando não há frases salvas', () => {
      expect(service.getPhrases()).toEqual([])
    })

    it('retorna as frases salvas', () => {
      const phrases = [{ id: '1', english: 'Hi', portuguese: 'Oi' }]
      service.setPhrases(phrases)
      expect(service.getPhrases()).toEqual(phrases)
    })

    it('retorna [] se o JSON salvo for inválido', () => {
      localStorage.setItem(KEYS.PHRASES, 'invalid-json')
      expect(service.getPhrases()).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // Stats
  // -------------------------------------------------------------------------

  describe('getStats / setStats', () => {
    it('retorna stats padrão quando não há dados salvos', () => {
      expect(service.getStats()).toEqual({ reviewed: 0, easy: 0, hard: 0 })
    })

    it('retorna stats salvas', () => {
      service.setStats({ reviewed: 5, easy: 3, hard: 2 })
      expect(service.getStats()).toEqual({ reviewed: 5, easy: 3, hard: 2 })
    })

    it('retorna stats padrão se JSON inválido', () => {
      localStorage.setItem(KEYS.STATS, 'broken')
      expect(service.getStats()).toEqual({ reviewed: 0, easy: 0, hard: 0 })
    })
  })

  describe('updateStats', () => {
    it('incrementa reviewed e easy para rating easy', () => {
      const stats = service.updateStats('easy')
      expect(stats.reviewed).toBe(1)
      expect(stats.easy).toBe(1)
      expect(stats.hard).toBe(0)
    })

    it('incrementa reviewed e hard para rating hard', () => {
      const stats = service.updateStats('hard')
      expect(stats.reviewed).toBe(1)
      expect(stats.hard).toBe(1)
      expect(stats.easy).toBe(0)
    })

    it('acumula múltiplas chamadas', () => {
      service.updateStats('easy')
      service.updateStats('hard')
      const stats = service.updateStats('easy')
      expect(stats.reviewed).toBe(3)
      expect(stats.easy).toBe(2)
      expect(stats.hard).toBe(1)
    })
  })

  // -------------------------------------------------------------------------
  // API Key
  // -------------------------------------------------------------------------

  describe('getApiKey / setApiKey', () => {
    it('retorna string vazia quando não há API key', () => {
      expect(service.getApiKey()).toBe('')
    })

    it('retorna a API key salva', () => {
      service.setApiKey('sk-test-key')
      expect(service.getApiKey()).toBe('sk-test-key')
    })
  })

  // -------------------------------------------------------------------------
  // Auth session
  // -------------------------------------------------------------------------

  describe('getAccessToken / isAuthenticated', () => {
    it('retorna string vazia quando não há token', () => {
      expect(service.getAccessToken()).toBe('')
    })

    it('isAuthenticated retorna false sem token', () => {
      expect(service.isAuthenticated()).toBe(false)
    })

    it('isAuthenticated retorna true com token salvo', () => {
      service.setSession('jwt-token', { id: '1', email: 'a@b.com' })
      expect(service.isAuthenticated()).toBe(true)
    })
  })

  describe('getAuthUser', () => {
    it('retorna null quando não há usuário salvo', () => {
      expect(service.getAuthUser()).toBeNull()
    })

    it('retorna o usuário salvo pela setSession', () => {
      service.setSession('tok', { id: 'uid-1', email: 'a@b.com' })
      expect(service.getAuthUser()).toEqual({ id: 'uid-1', email: 'a@b.com' })
    })

    it('retorna null se JSON inválido', () => {
      localStorage.setItem(KEYS.AUTH_USER, 'bad-json')
      expect(service.getAuthUser()).toBeNull()
    })
  })

  describe('getAuthEmail', () => {
    it('retorna string vazia sem usuário', () => {
      expect(service.getAuthEmail()).toBe('')
    })

    it('retorna o email do usuário salvo', () => {
      service.setSession('tok', { id: '1', email: 'user@example.com' })
      expect(service.getAuthEmail()).toBe('user@example.com')
    })
  })

  describe('logout', () => {
    it('remove token e usuário do localStorage', () => {
      service.setSession('tok', { id: '1', email: 'a@b.com' })
      service.logout()
      expect(service.isAuthenticated()).toBe(false)
      expect(service.getAuthUser()).toBeNull()
    })

    it('não afeta outras chaves do localStorage', () => {
      service.setApiKey('my-key')
      service.setSession('tok', { id: '1', email: 'a@b.com' })
      service.logout()
      expect(service.getApiKey()).toBe('my-key')
    })
  })
})
