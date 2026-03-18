/**
 * @file Label.jsx
 * @description Label de seção no estilo monospace âmbar, usado acima de grupos de opções.
 *
 * Padrão visual consolidado: `font-mono · text-xs · text-amber-500/70 · uppercase · tracking-widest`.
 *
 * @module ui/Label
 */

/**
 * Label de seção estilizada.
 *
 * @param {object}          props
 * @param {React.ReactNode} props.children   - Texto da label.
 * @param {string}          [props.className] - Classes extras.
 *
 * @example
 * <Label>Tópico</Label>
 * <Label>OpenAI API Key</Label>
 */
export default function Label({ children, className = '' }) {
  return (
    <span
      className={`block font-mono text-xs text-amber-500/70 uppercase tracking-widest ${className}`}
    >
      {children}
    </span>
  )
}
