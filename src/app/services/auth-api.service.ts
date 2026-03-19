import { Injectable } from '@angular/core';
import { z } from 'zod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../ui/utils/environment';

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
  constructor(private readonly http: HttpClient) {}

  private get backendUrl(): string {
    return environment.backendUrl;
  }

  private async requestJson(url: string, init: { method: string; body?: unknown; headers?: Record<string, string> }): Promise<unknown> {
    try {
      return await firstValueFrom(
        this.http.request<unknown>(init.method, url, {
          body: init.body,
          headers: init.headers,
        }),
      );
    } catch (err) {
      const e = err as HttpErrorResponse;
      const payload = e.error as unknown;
      const msg =
        typeof payload === 'object' && payload && 'message' in payload
          ? String((payload as { message?: unknown }).message ?? '')
          : typeof payload === 'string'
            ? payload
            : e.message;
      throw new Error(msg || `Erro ${e.status ?? ''}`);
    }
  }

  async register(email: string, password: string): Promise<AuthTokenResponse> {
    const url = `${this.backendUrl}/auth/register`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email, password },
    });
    return authTokenResponseSchema.parse(data);
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const url = `${this.backendUrl}/auth/login`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email, password },
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
