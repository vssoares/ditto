/**
 * @file Spinner.jsx
 * @description Indicador de carregamento circular (spinner) em CSS puro.
 *
 * @module ui/Spinner
 */

/**
 * @typedef {'sm' | 'md' | 'lg'} SpinnerSize
 */

const SIZES = {
  sm: 'w-3 h-3 border-[1.5px]',
  md: 'w-4 h-4 border-2',
  lg: 'w-6 h-6 border-2',
}

/**
 * Spinner de carregamento circular.
 *
 * @param {object}      props
 * @param {SpinnerSize} [props.size='md']      - Tamanho do spinner.
 * @param {string}      [props.color='current'] - Cor da borda ativa (classe Tailwind ou 'current').
 * @param {string}      [props.className='']   - Classes extras.
 *
 * @example
 * // Spinner padrão
 * <Spinner />
 *
 * @example
 * // Spinner grande branco
 * <Spinner size="lg" className="text-chalk" />
 */
export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      className={[
        'inline-block rounded-full border-current/30 border-t-current animate-spin',
        SIZES[size],
        className,
      ].join(' ')}
    />
  )
}
