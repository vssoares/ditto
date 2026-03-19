import { z } from 'zod'

const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
})

const authTokenResponseSchema = z.object({
  token: z.string(),
  user: authUserSchema,
})

const authMeResponseSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
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

export type AuthUser = z.infer<typeof authUserSchema>
export type AuthTokenResponse = z.infer<typeof authTokenResponseSchema>
export type AuthMeResponse = z.infer<typeof authMeResponseSchema>

export async function authRegister(email: string, password: string): Promise<AuthTokenResponse> {
  const url = `${getBackendUrl()}/auth/register`
  const data = await requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return authTokenResponseSchema.parse(data)
}

export async function authLogin(email: string, password: string): Promise<AuthTokenResponse> {
  const url = `${getBackendUrl()}/auth/login`
  const data = await requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return authTokenResponseSchema.parse(data)
}

export async function authMe(token: string): Promise<AuthMeResponse> {
  const url = `${getBackendUrl()}/auth/me`
  const data = await requestJson(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return authMeResponseSchema.parse(data)
}

