import { useState } from 'react'
import { storage } from '../utils/storage'
import { Button, Label, SelectOption, ErrorBanner } from './ui'
/** @typedef {import('../utils/types').Phrase} Phrase */

/**
 * Tópicos disponíveis para geração de frases.
 * @type {{ id: string, label: string, icon: string }[]}
 */
const TOPICS = [
  { id: 'daily',    label: 'Cotidiano',   icon: '☀' },
  { id: 'work',     label: 'Trabalho',    icon: '💼' },
  { id: 'travel',   label: 'Viagem',      icon: '✈' },
  { id: 'food',     label: 'Comida',      icon: '🍽' },
  { id: 'tech',     label: 'Tecnologia',  icon: '💻' },
  { id: 'social',   label: 'Social',      icon: '💬' },
  { id: 'health',   label: 'Saúde',       icon: '🏃' },
  { id: 'academic', label: 'Acadêmico',   icon: '📚' },
]

/**
 * Níveis de proficiência disponíveis.
 * @type {{ id: string, label: string, desc: string }[]}
 */
const LEVELS = [
  { id: 'beginner',     label: 'Iniciante',     desc: 'A1 / A2' },
  { id: 'intermediate', label: 'Intermediário',  desc: 'B1 / B2' },
  { id: 'advanced',     label: 'Avançado',       desc: 'C1 / C2' },
]

/** Opções de quantidade de frases a gerar. */
const COUNTS = [5, 10, 15, 20]

/**
 * Tela de geração de frases.
 * Permite escolher tópico, nível e quantidade; chama a API via Electron IPC.
 *
 * @param {object}   props
 * @param {Function} props.onGenerate - `(phrases: Phrase[]) => void` — chamado após geração bem-sucedida.
 */
export default function GeneratorScreen({ onGenerate }) {
  const [topic, setTopic]   = useState('daily')
  const [level, setLevel]   = useState('beginner')
  const [count, setCount]   = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleGenerate = async () => {
    const apiKey = storage.getApiKey()
    if (!apiKey) {
      setError('Configure sua OpenAI API Key nas configurações antes de gerar.')
      return
    }
    setError('')
    setLoading(true)

    const topicLabel = TOPICS.find((t) => t.id === topic)?.label || topic

    try {
      const result = await window.electronAPI.generatePhrases({ apiKey, topic: topicLabel, level, count })

      if (!result.success) {
        setError(result.error || 'Erro ao gerar frases.')
      } else {
        const phrases = result.phrases.map((p, i) => ({ id: `${Date.now()}_${i}`, ...p }))
        onGenerate(phrases)
      }
    } catch (err) {
      setError(err.message || 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 animate-fade-up">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="font-display text-4xl text-chalk mb-2">
            Gerar <span className="text-amber-400 italic">Frases</span>
          </h1>
          <p className="text-chalk/40 font-mono text-xs tracking-wider uppercase">
            Powered by Vaqueiro · Ditto
          </p>
        </div>

        {/* Tópico */}
        <div>
          <Label className="mb-3">Tópico</Label>
          <div className="grid grid-cols-4 gap-2">
            {TOPICS.map((t) => (
              <SelectOption
                key={t.id}
                layout="card"
                icon={t.icon}
                label={t.label}
                selected={topic === t.id}
                onSelect={() => setTopic(t.id)}
              />
            ))}
          </div>
        </div>

        {/* Nível */}
        <div>
          <Label className="mb-3">Nível</Label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <SelectOption
                key={l.id}
                layout="pill"
                label={l.label}
                sublabel={l.desc}
                selected={level === l.id}
                onSelect={() => setLevel(l.id)}
              />
            ))}
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <Label className="mb-3">Quantidade de frases</Label>
          <div className="flex gap-2">
            {COUNTS.map((c) => (
              <SelectOption
                key={c}
                label={String(c)}
                selected={count === c}
                onSelect={() => setCount(c)}
                className="w-14 h-10 !py-0 !px-0 justify-center items-center flex"
              />
            ))}
          </div>
        </div>

        <ErrorBanner message={error} />

        <Button fullWidth size="lg" loading={loading} onClick={handleGenerate}>
          {loading ? 'Gerando frases...' : 'Gerar Frases →'}
        </Button>

      </div>
    </div>
  )
}
