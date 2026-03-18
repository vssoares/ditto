/**
 * @file ErrorBanner.jsx
 * @description Banner de alerta/erro inline — exibido dentro de formulários ou telas
 * para comunicar falhas sem interromper o fluxo com um modal.
 *
 * @module ui/ErrorBanner
 */

/**
 * @typedef {'error' | 'warning' | 'info'} BannerVariant
 */

const VARIANTS = {
  error:   'bg-red-900/20 border-red-800 text-red-400',
  warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-400',
  info:    'bg-blue-900/20 border-blue-800 text-blue-400',
}

const ICONS = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

/**
 * Banner de alerta inline.
 *
 * @param {object}       props
 * @param {string}       props.message           - Mensagem exibida.
 * @param {BannerVariant} [props.variant='error'] - Variante de cor.
 * @param {boolean}      [props.showIcon=true]   - Exibe ícone prefixo.
 * @param {string}       [props.className='']    - Classes extras.
 *
 * @example
 * {error && <ErrorBanner message={error} />}
 *
 * @example
 * <ErrorBanner
 *   variant="warning"
 *   message="Configure sua API Key antes de gerar."
 * />
 */
export default function ErrorBanner({ message, variant = 'error', showIcon = true, className = '' }) {
  if (!message) return null

  return (
    <div
      className={[
        'border rounded-xl px-4 py-3 font-mono text-xs flex items-start gap-2',
        VARIANTS[variant],
        className,
      ].join(' ')}
    >
      {showIcon && <span className="shrink-0 mt-px">{ICONS[variant]}</span>}
      <span>{message}</span>
    </div>
  )
}
