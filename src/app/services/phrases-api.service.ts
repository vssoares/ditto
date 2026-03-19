import { Injectable } from '@angular/core';
import { z } from 'zod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Phrase, Rating } from '../ui/utils/types';
import { environment } from '../ui/utils/environment';

const ratingSchema = z.enum(['again', 'hard', 'ok', 'easy']);

const maybeNumber = z
  .number()
  .nullable()
  .transform((v) => (v === null ? undefined : v))
  .optional();

const phraseSchema = z.object({
  id: z.string(),
  english: z.string(),
  portuguese: z.string(),
  tip: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ease: maybeNumber,
  interval: maybeNumber,
  repetitions: maybeNumber,
  nextReview: maybeNumber,
  lastReview: maybeNumber,
  phraseId: z.string().optional(),
  rating: ratingSchema
    .nullable()
    .transform((v) => (v === null ? undefined : v))
    .optional(),
});

const phrasesResponseSchema = z.object({
  phrases: z.array(phraseSchema),
});

const phrasesArraySchema = z.array(phraseSchema);

const normalizePhrasesResponse = (data: unknown): Phrase[] => {
  // Alguns endpoints do back retornam `{ phrases: [...] }`,
  // outros retornam diretamente `[...]`.
  if (Array.isArray(data)) return phrasesArraySchema.parse(data);
  const parsed = phrasesResponseSchema.parse(data);
  return parsed.phrases;
};

@Injectable({ providedIn: 'root' })
export class PhrasesApiService {
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

  async generatePhrases(params: {
    topic: string;
    level: string;
    count: number;
    token: string;
  }): Promise<{ phrases: Phrase[] }> {
    const url = `${this.backendUrl}/phrases`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${params.token}` },
      body: {
        topic: params.topic,
        level: params.level,
        count: params.count,
      },
    });
    const phrases = normalizePhrasesResponse(data);
    return { phrases };
  }

  async getUnreviewedPhrases(token: string): Promise<Phrase[]> {
    const url = `${this.backendUrl}/phrases/unreviewed`;
    const data = await this.requestJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return normalizePhrasesResponse(data);
  }

  async getReviewedPhrases(token: string): Promise<Phrase[]> {
    const url = `${this.backendUrl}/phrases/reviewed`;
    const data = await this.requestJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return normalizePhrasesResponse(data);
  }

  async reviewPhrase(params: {
    token: string;
    phraseId: string;
    rating: Rating;
  }): Promise<void> {
    const url = `${this.backendUrl}/phrases/${encodeURIComponent(params.phraseId)}/review`;

    await this.requestJson(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${params.token}` },
      body: {
        rating: params.rating,
      },
    });
  }
}
