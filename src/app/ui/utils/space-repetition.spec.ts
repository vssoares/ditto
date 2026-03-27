import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { updatePhrase, getDueCount, sortByDue } from './space-repetition'
import type { Phrase } from './types'

function makePhrase(overrides: Partial<Phrase> = {}): Phrase {
  return {
    id: '1',
    english: 'Hello',
    portuguese: 'Olá',
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    ...overrides,
  }
}

const NOW = 1_000_000_000_000
const DAY_MS = 24 * 60 * 60 * 1000

describe('updatePhrase', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('rating "again" reseta repetitions para 0 e interval para 1', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 3, interval: 10, ease: 2.5 })
    const result = updatePhrase(phrase, 'again')

    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
    expect(result.ease).toBeCloseTo(2.3)
  })

  it('rating "again" não deixa ease cair abaixo de 1.3', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ ease: 1.3 })
    const result = updatePhrase(phrase, 'again')

    expect(result.ease).toBeCloseTo(1.3)
  })

  it('rating "hard" incrementa repetitions e ajusta interval', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 2, interval: 5, ease: 2.5 })
    const result = updatePhrase(phrase, 'hard')

    expect(result.repetitions).toBe(3)
    expect(result.interval).toBe(Math.max(1, Math.round(5 * 1.2)))
    expect(result.ease).toBeCloseTo(2.35)
  })

  it('rating "ok" no primeiro card define interval 1', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 0 })
    const result = updatePhrase(phrase, 'ok')

    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(1)
  })

  it('rating "ok" no segundo card define interval 3', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 1, interval: 1 })
    const result = updatePhrase(phrase, 'ok')

    expect(result.interval).toBe(3)
  })

  it('rating "ok" a partir do terceiro card multiplica interval por ease', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 2, interval: 4, ease: 2.5 })
    const result = updatePhrase(phrase, 'ok')

    expect(result.interval).toBe(Math.round(4 * 2.5))
  })

  it('rating "easy" no primeiro card define interval 4', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 0 })
    const result = updatePhrase(phrase, 'easy')

    expect(result.interval).toBe(4)
    expect(result.repetitions).toBe(1)
  })

  it('rating "easy" incrementa ease em 0.1', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ ease: 2.5 })
    const result = updatePhrase(phrase, 'easy')

    expect(result.ease).toBeCloseTo(2.6)
  })

  it('atualiza nextReview para agora + interval dias', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ repetitions: 0 })
    const result = updatePhrase(phrase, 'easy')

    expect(result.nextReview).toBe(NOW + 4 * DAY_MS)
  })

  it('atualiza lastReview para o momento atual', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase()
    const result = updatePhrase(phrase, 'ok')

    expect(result.lastReview).toBe(NOW)
  })

  it('preserva os demais campos da frase', () => {
    vi.setSystemTime(NOW)
    const phrase = makePhrase({ english: 'Test', portuguese: 'Teste', tip: 'tip here' })
    const result = updatePhrase(phrase, 'ok')

    expect(result.english).toBe('Test')
    expect(result.portuguese).toBe('Teste')
    expect(result.tip).toBe('tip here')
  })

  it('usa defaults quando ease/interval/repetitions são undefined', () => {
    vi.setSystemTime(NOW)
    const phrase: Phrase = { id: '1', english: 'X', portuguese: 'Y' }
    expect(() => updatePhrase(phrase, 'ok')).not.toThrow()
  })
})

describe('getDueCount', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW) })
  afterEach(() => vi.useRealTimers())

  it('conta frases sem lastReview como pendentes', () => {
    const phrases = [
      makePhrase({ lastReview: undefined }),
      makePhrase({ lastReview: undefined }),
    ]
    expect(getDueCount(phrases)).toBe(2)
  })

  it('não conta frases revisadas com nextReview no futuro', () => {
    const phrases = [
      makePhrase({ lastReview: NOW - 1000, nextReview: NOW + DAY_MS }),
    ]
    expect(getDueCount(phrases)).toBe(0)
  })

  it('conta frases revisadas com nextReview vencido', () => {
    const phrases = [
      makePhrase({ lastReview: NOW - DAY_MS, nextReview: NOW - 1000 }),
    ]
    expect(getDueCount(phrases)).toBe(1)
  })

  it('retorna 0 para lista vazia', () => {
    expect(getDueCount([])).toBe(0)
  })

  it('mistura frases pendentes e vencidas corretamente', () => {
    const phrases = [
      makePhrase({ lastReview: undefined }),
      makePhrase({ lastReview: NOW - DAY_MS, nextReview: NOW - 1000 }),
      makePhrase({ lastReview: NOW - 1000, nextReview: NOW + DAY_MS }),
    ]
    expect(getDueCount(phrases)).toBe(2)
  })
})

describe('sortByDue', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW) })
  afterEach(() => vi.useRealTimers())

  it('coloca frases sem lastReview antes das revisadas', () => {
    const reviewed = makePhrase({ id: '2', lastReview: NOW - 1000, nextReview: NOW - 500 })
    const unreviewed = makePhrase({ id: '1', lastReview: undefined })
    const result = sortByDue([reviewed, unreviewed])

    expect(result[0]!.id).toBe('1')
    expect(result[1]!.id).toBe('2')
  })

  it('coloca frases vencidas antes das futuras', () => {
    const future = makePhrase({ id: '2', lastReview: NOW - 1000, nextReview: NOW + DAY_MS })
    const due = makePhrase({ id: '1', lastReview: NOW - DAY_MS, nextReview: NOW - 1000 })
    const result = sortByDue([future, due])

    expect(result[0]!.id).toBe('1')
  })

  it('ordena frases vencidas por nextReview crescente', () => {
    const due1 = makePhrase({ id: '1', lastReview: NOW - 2000, nextReview: NOW - 2000 })
    const due2 = makePhrase({ id: '2', lastReview: NOW - 1000, nextReview: NOW - 1000 })
    const result = sortByDue([due2, due1])

    expect(result[0]!.id).toBe('1')
  })

  it('não muta o array original', () => {
    const phrases = [makePhrase({ id: '2', lastReview: NOW, nextReview: NOW + DAY_MS }), makePhrase({ id: '1' })]
    const original = [...phrases]
    sortByDue(phrases)

    expect(phrases[0]!.id).toBe(original[0]!.id)
  })

  it('retorna array vazio para lista vazia', () => {
    expect(sortByDue([])).toEqual([])
  })
})
