import { useState, useEffect, useCallback } from 'react'
import { sortByDue } from '../utils/spaceRepetition'
import { storage } from '../utils/storage'
import type { Phrase, Rating } from '../utils/types'
import { reviewPhrase } from '../utils/phrasesApi'
import { Button, Badge, ProgressBar, StatCard, ErrorBanner } from './ui'

interface StudyScreenProps {
  phrases: Phrase[]
  onBack: () => void
  onFinish: () => void
}

interface SessionStats {
  easy: number
  ok: number
  hard: number
  again: number
}

const RATING_BUTTONS: { id: Rating; label: string; key: string; hoverClass: string }[] = [
  { id: 'again', label: 'De novo', key: '1', hoverClass: 'hover:bg-red-900/40 hover:border-red-700 hover:text-red-400' },
  { id: 'hard', label: 'Difícil', key: '2', hoverClass: 'hover:bg-orange-900/40 hover:border-orange-700 hover:text-orange-400' },
  { id: 'ok', label: 'Ok', key: '3', hoverClass: 'hover:bg-blue-900/40 hover:border-blue-700 hover:text-blue-400' },
  { id: 'easy', label: 'Fácil', key: '4', hoverClass: 'hover:bg-green-900/40 hover:border-green-700 hover:text-green-400' },
]

export default function StudyScreen({
  phrases: initialPhrases,
  onBack,
  onFinish,
}: StudyScreenProps) {
  const [phrases, setPhrases] = useState<Phrase[]>(() => sortByDue(initialPhrases))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    easy: 0,
    ok: 0,
    hard: 0,
    again: 0,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const current = phrases[index]

  const handleFlip = useCallback(() => {
    if (!flipped) setFlipped(true)
  }, [flipped])

  const handleRating = useCallback(
    async (rating: Rating) => {
      if (!flipped || !current) return
      if (submitting) return

      const token = storage.getAccessToken()
      if (!token) {
        setError('Não autenticado.')
        return
      }

      setSubmitting(true)
      setError('')
      try {
        await reviewPhrase({ token, phraseId: current.id, rating })
        setSessionStats((s) => ({ ...s, [rating]: s[rating] + 1 }))
        setFlipped(false)

        if (index + 1 >= phrases.length) {
          setDone(true)
        } else {
          setIndex((i) => i + 1)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro inesperado.')
      } finally {
        setSubmitting(false)
      }
    },
    [flipped, current, phrases.length, index, submitting]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
      }
      if (flipped) {
        if (submitting) return
        if (e.code === 'Digit1') handleRating('again')
        if (e.code === 'Digit2') handleRating('hard')
        if (e.code === 'Digit3') handleRating('ok')
        if (e.code === 'Digit4') handleRating('easy')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleFlip, handleRating, flipped])

  if (done) {
    return (
      <FinishScreen
        stats={sessionStats}
        total={phrases.length}
        onBack={onBack}
        onFinish={onFinish}
      />
    )
  }

  if (!current) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col p-6 animate-fade-in">

      {/* Barra de progresso */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>← voltar</Button>
        <ProgressBar value={index} max={phrases.length} className="flex-1" />
        <span className="font-mono text-xs text-chalk/30">
          {index + 1}/{phrases.length}
        </span>
      </div>

      {/* Área do card */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">

        {/* Flashcard com animação 3D flip */}
        <div
          className="perspective w-full max-w-xl cursor-pointer"
          style={{ height: '260px' }}
          onClick={handleFlip}
        >
          <div className={`card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>

            {/* Frente: frase em inglês */}
            <div className="card-front w-full h-full bg-ink-800 border border-ink-600 rounded-2xl p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-amber-500/40 uppercase tracking-widest">Inglês</span>
                <div className="flex gap-1">
                  {current.keywords?.map((kw) => (
                    <Badge key={kw}>{kw}</Badge>
                  ))}
                </div>
              </div>

              <p className="font-display text-3xl text-chalk leading-relaxed italic text-center">
                &quot;{current.english}&quot;
              </p>

              <p className="font-mono text-xs text-chalk/20 text-center">
                clique para ver a tradução · espaço
              </p>
            </div>

            {/* Verso: tradução + dica */}
            <div className="card-back bg-ink-800 border border-amber-500/30 rounded-2xl p-8 flex flex-col justify-between">
              <span className="font-mono text-xs text-amber-500/60 uppercase tracking-widest">Tradução</span>

              <div className="space-y-3 text-center">
                <p className="font-display text-2xl text-amber-400 italic">
                  &quot;{current.portuguese}&quot;
                </p>
                {current.tip && (
                  <p className="font-sans text-sm text-chalk/50 bg-ink-900/60 rounded-xl px-4 py-2">
                    💡 {current.tip}
                  </p>
                )}
              </div>

              <p className="font-mono text-xs text-chalk/20 text-center">Como você se saiu?</p>
            </div>
          </div>
        </div>

        {/* Botões de avaliação */}
        {error ? <ErrorBanner message={error} /> : null}
        <div
          className={`flex gap-3 w-full max-w-xl transition-all duration-300 ${
            flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {RATING_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleRating(btn.id)}
              disabled={submitting}
              className={`flex-1 py-3 px-2 rounded-xl border border-ink-600 bg-ink-800 transition-all duration-150 ${btn.hoverClass} text-chalk/50 group`}
            >
              <div className="font-sans font-medium text-sm group-hover:text-inherit">{btn.label}</div>
              <div className="font-mono text-xs text-chalk/25 mt-0.5">[{btn.key}]</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface FinishScreenProps {
  stats: SessionStats
  total: number
  onBack: () => void
  onFinish: () => void
}

function FinishScreen({ stats, total, onBack, onFinish }: FinishScreenProps) {
  const score = Math.round(((stats.easy + stats.ok) / total) * 100)
  const emoji = score >= 80 ? '🎉' : score >= 50 ? '💪' : '📖'
  const title = score >= 80 ? 'Excelente!' : score >= 50 ? 'Bom trabalho!' : 'Continue praticando!'

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-up">
      <div className="text-center max-w-sm space-y-6">
        <div className="text-6xl font-display">{emoji}</div>

        <div>
          <h2 className="font-display text-4xl text-chalk mb-1">{title}</h2>
          <p className="text-chalk/40 font-mono text-xs">Sessão concluída · {total} frases</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatCard value={stats.easy} label="Fácil" color="text-green-400" />
          <StatCard value={stats.ok} label="Ok" color="text-blue-400" />
          <StatCard value={stats.hard} label="Difícil" color="text-orange-400" />
          <StatCard value={stats.again} label="De novo" color="text-red-400" />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onBack}>Gerar mais</Button>
          <Button variant="primary" fullWidth onClick={onFinish}>Revisar frases</Button>
        </div>
      </div>
    </div>
  )
}
