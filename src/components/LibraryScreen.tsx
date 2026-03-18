import { useState } from 'react'
import { storage } from '../utils/storage'
import type { Phrase } from '../utils/types'
import { Button, Badge, Card, FilterPill, EmptyState } from './ui'

function formatNextReview(ts: number | undefined, now: number): string {
  if (!ts) return 'novo'
  const diff = ts - now
  if (diff <= 0) return 'vencido'
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

interface LibraryScreenProps {
  onStudy: (phrases: Phrase[]) => void
}

export default function LibraryScreen({ onStudy }: LibraryScreenProps) {
  const [phrases] = useState<Phrase[]>(() => storage.getPhrases())
  const [filter, setFilter] = useState<'all' | 'due' | 'learned'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const now = Date.now()

  const dueCount = phrases.filter((p) => !p.nextReview || p.nextReview <= now).length

  const FILTERS = [
    { id: 'all' as const, label: `Todas (${phrases.length})` },
    { id: 'due' as const, label: `Revisar (${dueCount})` },
    { id: 'learned' as const, label: 'Aprendidas' },
  ]

  const filtered = phrases.filter((p) => {
    if (filter === 'due') return !p.nextReview || p.nextReview <= now
    if (filter === 'learned') return !!(p.nextReview && p.nextReview > now && (p.repetitions ?? 0) >= 3)
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
                <p className="font-display text-chalk text-lg truncate">&quot;{phrase.english}&quot;</p>

                {expandedId === phrase.id && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    <p className="font-sans text-amber-400/80 text-sm italic">
                      &quot;{phrase.portuguese}&quot;
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
