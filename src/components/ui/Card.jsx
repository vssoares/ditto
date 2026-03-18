/**
 * @file Card.jsx
 * @description Superfície de card genérica com variantes de borda e comportamento de clique.
 *
 * @module ui/Card
 */

/**
 * @typedef {'default' | 'active' | 'highlight' | 'flat'} CardVariant
 *
 * - **default**   → borda neutra + fundo escuro. Container padrão.
 * - **active**    → borda âmbar sutil. Card selecionado/em foco.
 * - **highlight** → borda âmbar mais intensa. Destaque forte (card de estudo virado).
 * - **flat**      → sem borda. Container silencioso.
 */

const VARIANTS = {
  default:
    'bg-ink-800 border border-ink-600',
  active:
    'bg-ink-800 border border-amber-500/30',
  highlight:
    'bg-ink-800 border border-amber-500',
  flat:
    'bg-ink-800',
}

/**
 * Container de card genérico.
 *
 * @param {object}          props
 * @param {CardVariant}     [props.variant='default'] - Variante de borda/destaque.
 * @param {boolean}         [props.hoverable=false]   - Adiciona efeito hover (border + cursor pointer).
 * @param {string}          [props.className='']      - Classes extras.
 * @param {Function}        [props.onClick]           - Torna o card clicável.
 * @param {React.ReactNode} props.children            - Conteúdo interno.
 *
 * @example
 * // Card simples
 * <Card><p>Conteúdo</p></Card>
 *
 * @example
 * // Card clicável com hover
 * <Card hoverable onClick={handleClick}>Item da lista</Card>
 *
 * @example
 * // Card ativo (selecionado)
 * <Card variant="active">Frase selecionada</Card>
 */
export default function Card({ variant = 'default', hoverable = false, className = '', onClick, children }) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-xl transition-all duration-150',
        VARIANTS[variant],
        hoverable ? 'hover:border-ink-500 cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
