import { z } from 'zod'
import type { Phrase, Rating } from './types'

const ratingSchema = z.enum(['again', 'hard', 'ok', 'easy'])

// Compat: alguns backends podem retornar `null` para campos numéricos.
// O app usa `undefined` para "ausente", então normalizamos `null -> undefined`.
const maybeNumber = z
  .number()
  .nullable()
  .transform((v) => (v === null ? undefined : v))
  .optional()

const phraseSchema = z.object({
  id: z.string(),
  english: z.string(),
  portuguese: z.string(),
  tip: z.string().optional(),
  keywords: z.array(z.string()).optional(),

  // Campos de SRS (SM-2) — podem estar ausentes dependendo do endpoint.
  ease: maybeNumber,
  interval: maybeNumber,
  repetitions: maybeNumber,
  nextReview: maybeNumber,
  lastReview: maybeNumber,

  // Última avaliação (opcional).
  // Alguns backends retornam `null` em vez de omitir a chave.
  rating: ratingSchema
    .nullable()
    .transform((v) => (v === null ? undefined : v))
    .optional(),
})

const phrasesResponseSchema = z.object({
  phrases: z.array(phraseSchema),
})

function getBackendUrl(): string {
  return (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? 'http://localhost:3000'
}

async function requestJson(input: string, init: RequestInit): Promise<unknown> {
  const res = await fetch(input, init)
  const text = await res.text()

  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message?: unknown }).message ?? '')
        : typeof data === 'string'
          ? data
          : `Erro ${res.status}`

    throw new Error(msg || `Erro ${res.status}`)
  }

  return data
}

export type GeneratedPhrase = z.infer<typeof phraseSchema>

export async function generatePhrases(params: {
  topic: string
  level: string
  count: number
  token: string
}): Promise<{ phrases: Phrase[] }> {
  const url = `${getBackendUrl()}/phrases`
  const data = await requestJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    // Envia apenas os dados esperados pelo backend (topic/level/count).
    body: JSON.stringify({
      topic: params.topic,
      level: params.level,
      count: params.count,
    }),
  })
  const parsed = phrasesResponseSchema.parse(data)
  return { phrases: parsed.phrases }
}

export async function getUnreviewedPhrases(token: string): Promise<Phrase[]> {
  const url = `${getBackendUrl()}/phrases/unreviewed`
  const data = await requestJson(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const parsed = phrasesResponseSchema.parse(data)
  return parsed.phrases
}

export async function getReviewedPhrases(token: string): Promise<Phrase[]> {
  const url = `${getBackendUrl()}/phrases/reviewed`
  const data = await requestJson(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const parsed = phrasesResponseSchema.parse(data)
  return parsed.phrases
}

export async function reviewPhrase(params: {
  token: string
  phraseId: string
  rating: Rating
}): Promise<void> {
  const url = `${getBackendUrl()}/phrases/${encodeURIComponent(params.phraseId)}/review`

  await requestJson(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      rating: params.rating,
    }),
  })
}

