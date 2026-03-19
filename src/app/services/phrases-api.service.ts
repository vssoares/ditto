import { Injectable } from '@angular/core';
import { z } from 'zod';
import type { Phrase, Rating } from '../utils/types';
import { environment } from '../utils/environment';

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
  rating: ratingSchema
    .nullable()
    .transform((v) => (v === null ? undefined : v))
    .optional(),
});

const phrasesResponseSchema = z.object({
  phrases: z.array(phraseSchema),
});

@Injectable({ providedIn: 'root' })
export class PhrasesApiService {
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

  async generatePhrases(params: {
    topic: string;
    level: string;
    count: number;
    token: string;
  }): Promise<{ phrases: Phrase[] }> {
    const url = `${this.backendUrl}/phrases`;
    const data = await this.requestJson(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        topic: params.topic,
        level: params.level,
        count: params.count,
      }),
    });
    const parsed = phrasesResponseSchema.parse(data);
    return { phrases: parsed.phrases };
  }

  async getUnreviewedPhrases(token: string): Promise<Phrase[]> {
    const url = `${this.backendUrl}/phrases/unreviewed`;
    const data = await this.requestJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = phrasesResponseSchema.parse(data);
    return parsed.phrases;
  }

  async getReviewedPhrases(token: string): Promise<Phrase[]> {
    const url = `${this.backendUrl}/phrases/reviewed`;
    const data = await this.requestJson(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = phrasesResponseSchema.parse(data);
    return parsed.phrases;
  }

  async reviewPhrase(params: {
    token: string;
    phraseId: string;
    rating: Rating;
  }): Promise<void> {
    const url = `${this.backendUrl}/phrases/${encodeURIComponent(params.phraseId)}/review`;

    await this.requestJson(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        rating: params.rating,
      }),
    });
  }
}
