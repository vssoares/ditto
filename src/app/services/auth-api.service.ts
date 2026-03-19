import { Injectable } from '@angular/core';
import { z } from 'zod';
import { environment } from '../utils/environment';

const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

const authTokenResponseSchema = z.object({
  token: z.string(),
  user: authUserSchema,
});

const authMeResponseSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthTokenResponse = z.infer<typeof authTokenResponseSchema>;
export type AuthMeResponse = z.infer<typeof authMeResponseSchema>;

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private get backendUrl(): string {
    return environment.backendUrl;
  }

  private async requestJson(input: string, init: RequestInit): Promise<unknown> {
    const res = await fetch(input, init);
    const text = await res.text();

    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const msg =
        typeof data === 'object' && data && 'message' in data
          ? String((data as { message?: unknown }).message ?? '')
          : typeof data === 'string'
            ? data
            : `Erro ${res.status}`;

      throw new Error(msg || `Erro ${res.status}`);
    }

    return data;
  }

  async register(email: string, password: string): Promise<AuthTokenResponse> {
    const url = `${this.backendUrl}/auth/register`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return authTokenResponseSchema.parse(data);
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const url = `${this.backendUrl}/auth/login`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return authTokenResponseSchema.parse(data);
  }

  async me(token: string): Promise<AuthMeResponse> {
    const url = `${this.backendUrl}/auth/me`;
    const data = await this.requestJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return authMeResponseSchema.parse(data);
  }
}
