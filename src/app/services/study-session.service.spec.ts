import { describe, it, expect, beforeEach } from 'vitest'
import { StudySessionService } from './study-session.service'

describe('StudySessionService', () => {
  let service: StudySessionService

  beforeEach(() => {
    service = new StudySessionService()
  })

  it('getPhrases retorna null no estado inicial', () => {
    expect(service.getPhrases()).toBeNull()
  })

  it('setPhrases armazena frases e getPhrases as retorna', () => {
    const phrases = [{ id: '1', english: 'Hi', portuguese: 'Oi' }]
    service.setPhrases(phrases)
    expect(service.getPhrases()).toEqual(phrases)
  })

  it('clear() define getPhrases como null', () => {
    service.setPhrases([{ id: '1', english: 'Hi', portuguese: 'Oi' }])
    service.clear()
    expect(service.getPhrases()).toBeNull()
  })

  it('phrasesSignal() retorna o mesmo signal que reflete o estado', () => {
    const sig = service.phrasesSignal()
    expect(sig()).toBeNull()

    service.setPhrases([{ id: '2', english: 'Bye', portuguese: 'Tchau' }])
    expect(sig()).toHaveLength(1)
  })

  it('setPhrases substitui frases anteriores completamente', () => {
    service.setPhrases([{ id: '1', english: 'A', portuguese: 'A' }])
    service.setPhrases([{ id: '2', english: 'B', portuguese: 'B' }, { id: '3', english: 'C', portuguese: 'C' }])
    expect(service.getPhrases()).toHaveLength(2)
    expect(service.getPhrases()![0]!.id).toBe('2')
  })

  it('aceita array vazio', () => {
    service.setPhrases([])
    expect(service.getPhrases()).toEqual([])
  })
})
