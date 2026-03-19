import { z } from 'zod'

const phraseSchema = z.object({
  english: z.string(),
  portuguese: z.string(),
  tip: z.string().optional(),
  keywords: z.array(z.string()).optional(),
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
}): Promise<{ phrases: GeneratedPhrase[] }> {
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
  return phrasesResponseSchema.parse(data)
}

