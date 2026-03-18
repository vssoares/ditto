/**
 * @file ProgressBar.jsx
 * @description Barra de progresso horizontal animada.
 * Substitui o uso direto das classes CSS `.progress-bar` / `.progress-fill` do index.css.
 *
 * @module ui/ProgressBar
 */

/**
 * Barra de progresso horizontal.
 *
 * @param {object} props
 * @param {number} props.value              - Progresso atual (0–100).
 * @param {number} [props.max=100]          - Valor máximo (padrão: 100). O percentual é `value/max*100`.
 * @param {string} [props.className='']     - Classes extras no wrapper.
 *
 * @example
 * // 7 de 20 itens concluídos
 * <ProgressBar value={7} max={20} />
 *
 * @example
 * // Percentual direto
 * <ProgressBar value={45} />
 */
export default function ProgressBar({ value, max = 100, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`h-[2px] bg-ink-800 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
