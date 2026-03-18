/**
 * @file Badge.jsx
 * @description Badge/tag genérica para destacar palavras-chave, categorias ou status.
 *
 * @module ui/Badge
 */

/**
 * @typedef {'keyword' | 'rating' | 'status'} BadgeVariant
 *
 * - **keyword** → pill âmbar translúcido. Para tags/keywords de frases.
 * - **rating**  → colorido por resultado (easy/ok/hard/again). Para histórico de revisão.
 * - **status**  → neutro monocromático. Para rótulos de estado genéricos.
 */

/** Mapa de cores para a variante `rating`. */
const RATING_COLORS = {
  easy: 'text-green-400',
  ok: 'text-blue-400',
  hard: 'text-orange-400',
  again: 'text-red-400',
}

/**
 * Badge/pílula genérica.
 *
 * @param {object}       props
 * @param {BadgeVariant} [props.variant='keyword'] - Variante visual.
 * @param {string}       [props.rating]            - Valor do rating (usado quando variant='rating').
 * @param {string}       [props.className='']      - Classes extras.
 * @param {React.ReactNode} props.children         - Conteúdo da badge.
 *
 * @example
 * // Badge de keyword
 * <Badge>vocabulary</Badge>
 *
 * @example
 * // Badge de rating
 * <Badge variant="rating" rating="easy">easy</Badge>
 */
export default function Badge({ variant = 'keyword', rating, className = '', children }) {
  let classes = ''

  if (variant === 'keyword') {
    classes = 'px-2 py-0.5 bg-amber-500/10 text-amber-500/60 rounded-full font-mono text-xs'
  } else if (variant === 'rating') {
    const color = RATING_COLORS[rating] || 'text-chalk/30'
    classes = `font-mono text-xs ${color}`
  } else {
    classes = 'px-2 py-0.5 bg-ink-700 text-chalk/40 rounded-full font-mono text-xs'
  }

  return <span className={`${classes} ${className}`}>{children}</span>
}
