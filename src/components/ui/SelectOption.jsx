/**
 * @file SelectOption.jsx
 * @description Botão de seleção estilo "toggle card" — usado para escolher entre opções
 * exclusivas (tópico, nível, quantidade). Visualmente diferencia estado ativo/inativo.
 *
 * @module ui/SelectOption
 */

/**
 * @typedef {'card' | 'pill'} SelectOptionLayout
 *
 * - **card** → bloco vertical com ícone + label. Ideal para grids de tópicos.
 * - **pill** → bloco horizontal compacto. Ideal para sequências curtas (níveis, contagens).
 */

/**
 * Opção selecionável genérica.
 *
 * @param {object}          props
 * @param {boolean}         props.selected         - Se a opção está atualmente selecionada.
 * @param {Function}        props.onSelect         - Callback chamado ao clicar.
 * @param {SelectOptionLayout} [props.layout='pill'] - Layout visual.
 * @param {string}          [props.icon]           - Emoji/ícone exibido acima do label (layout card).
 * @param {string}          [props.label]          - Texto principal.
 * @param {string}          [props.sublabel]       - Texto secundário (ex.: "B1 / B2").
 * @param {string}          [props.className='']   - Classes extras.
 *
 * @example
 * // Grid de tópicos
 * {TOPICS.map(t => (
 *   <SelectOption
 *     key={t.id}
 *     layout="card"
 *     icon={t.icon}
 *     label={t.label}
 *     selected={topic === t.id}
 *     onSelect={() => setTopic(t.id)}
 *   />
 * ))}
 *
 * @example
 * // Seleção de quantidade
 * {[5, 10, 15, 20].map(n => (
 *   <SelectOption
 *     key={n}
 *     label={String(n)}
 *     selected={count === n}
 *     onSelect={() => setCount(n)}
 *   />
 * ))}
 */
export default function SelectOption({
  selected,
  onSelect,
  layout = 'pill',
  icon,
  label,
  sublabel,
  className = '',
}) {
  const base =
    'border transition-all duration-150 cursor-pointer font-sans text-sm'

  const activeClasses = 'border-amber-500 bg-amber-500/10 text-amber-400'
  const inactiveClasses =
    'border-ink-600 bg-ink-800 text-chalk/50 hover:border-ink-500 hover:text-chalk/70'

  if (layout === 'card') {
    return (
      <button
        onClick={onSelect}
        className={`${base} ${selected ? activeClasses : inactiveClasses} flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl ${className}`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <span className="font-sans text-xs font-medium">{label}</span>
      </button>
    )
  }

  // layout === 'pill'
  return (
    <button
      onClick={onSelect}
      className={`${base} ${selected ? activeClasses : inactiveClasses} py-3 px-4 rounded-xl text-left ${className}`}
    >
      <div className={`font-sans font-medium text-sm ${selected ? 'text-amber-400' : 'text-chalk/70'}`}>
        {label}
      </div>
      {sublabel && (
        <div className="font-mono text-xs text-chalk/30 mt-0.5">{sublabel}</div>
      )}
    </button>
  )
}
