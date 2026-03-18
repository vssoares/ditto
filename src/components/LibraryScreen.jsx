import { useState } from 'react'
import { storage } from '../utils/storage'
import { Button, Badge, Card, FilterPill, EmptyState } from './ui'
/** @typedef {import('../utils/types').Phrase} Phrase */

/**
 * Formata um timestamp Unix em texto relativo (ex.: "em 3 dias", "vencido").
 *
 * @param {number|undefined} ts  - Timestamp em ms.
 * @param {number}           now - Timestamp atual em ms.
 * @returns {string}
 */
function formatNextReview(ts, now) {
  if (!ts) return 'novo'
  const diff = ts - now
  if (diff <= 0) return 'vencido'
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

/**
 * Tela de biblioteca — exibe todas as frases salvas com filtros e suporte a expansão de detalhes.
 *
 * @param {object}   props
 * @param {Function} props.onStudy - `(phrases: Phrase[]) => void` — inicia sessão de estudo.
 */
export default function LibraryScreen({ onStudy }) {
  const [phrases]    = useState(storage.getPhrases())
  const [filter, setFilter]     = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const now = Date.now()

  const dueCount = phrases.filter((p) => !p.nextReview || p.nextReview <= now).length

  /** Opções de filtro com contagens dinâmicas. */
  const FILTERS = [
    { id: 'all',     label: `Todas (${phrases.length})` },
    { id: 'due',     label: `Revisar (${dueCount})` },
    { id: 'learned', label: 'Aprendidas' },
  ]

  const filtered = phrases.filter((p) => {
    if (filter === 'due')     return !p.nextReview || p.nextReview <= now
    if (filter === 'learned') return p.nextReview && p.nextReview > now && p.repetitions >= 3
    return true
  })

  if (phrases.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Biblioteca vazia"
        description="Gere frases para começar a estudar"
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-up">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-chalk">
            Biblioteca{' '}
            <span className="text-chalk/30 text-xl font-sans font-light">({phrases.length})</span>
          </h2>
          {dueCount > 0 && (
            <Button
              size="sm"
              onClick={() => onStudy(phrases.filter((p) => !p.nextReview || p.nextReview <= now))}
            >
              Revisar {dueCount} →
            </Button>
          )}
        </div>

        <FilterPill options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
        {filtered.map((phrase) => (
          <Card
            key={phrase.id}
            hoverable
            onClick={() => setExpandedId(expandedId === phrase.id ? null : phrase.id)}
          >
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display text-chalk text-lg truncate">"{phrase.english}"</p>

                {expandedId === phrase.id && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    <p className="font-sans text-amber-400/80 text-sm italic">
                      "{phrase.portuguese}"
                    </p>
                    {phrase.tip && (
                      <p className="font-sans text-xs text-chalk/40 bg-ink-900 rounded-lg px-3 py-2">
                        💡 {phrase.tip}
                      </p>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {phrase.keywords?.map((kw) => (
                        <Badge key={kw}>{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {phrase.rating && (
                  <Badge variant="rating" rating={phrase.rating}>
                    {phrase.rating}
                  </Badge>
                )}
                <span className="font-mono text-xs text-chalk/25">
                  {formatNextReview(phrase.nextReview, now)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
