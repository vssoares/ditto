/**
 * @file types.js
 * @description Definições de tipos JSDoc compartilhados por todo o projeto.
 *
 * @module utils/types
 */

/**
 * Representa uma frase gerada pela OpenAI, enriquecida com metadados de repetição espaçada.
 *
 * @typedef {object} Phrase
 *
 * — Campos gerados pela OpenAI:
 * @property {string}   english    - Frase em inglês.
 * @property {string}   portuguese - Tradução em português brasileiro.
 * @property {string}   [tip]      - Dica de gramática ou vocabulário.
 * @property {string[]} [keywords] - Palavras-chave da frase (2–3 itens).
 *
 * — Campos adicionados pelo app:
 * @property {string}  id          - ID único gerado em `Date.now() + índice`.
 *
 * — Campos do algoritmo SM-2 (repetição espaçada):
 * @property {number}  [ease]        - Fator de facilidade (padrão: 2.5, mínimo: 1.3).
 * @property {number}  [interval]    - Intervalo atual em dias até a próxima revisão.
 * @property {number}  [repetitions] - Quantas vezes a frase foi revisada com sucesso.
 * @property {number}  [nextReview]  - Timestamp (ms) da próxima revisão agendada.
 * @property {number}  [lastReview]  - Timestamp (ms) da última revisão feita.
 * @property {Rating}  [rating]      - Último resultado de avaliação do usuário.
 */

/**
 * Avaliação do usuário para uma frase durante a sessão de estudo.
 *
 * - **again** → Não lembrei. Reinicia o intervalo.
 * - **hard**  → Custou lembrar. Aumenta levemente o intervalo.
 * - **ok**    → Lembrei com esforço. Progressão normal SM-2.
 * - **easy**  → Lembrei facilmente. Aumenta intervalo e ease factor.
 *
 * @typedef {'again' | 'hard' | 'ok' | 'easy'} Rating
 */

/**
 * Estatísticas globais de estudo armazenadas no localStorage.
 *
 * @typedef {object} StudyStats
 * @property {number} reviewed - Total de frases revisadas (todas as sessões).
 * @property {number} easy     - Total de avaliações "easy" ou "ok".
 * @property {number} hard     - Total de avaliações "hard" ou "again".
 */

export {} // módulo apenas de tipos — sem exports funcionais
