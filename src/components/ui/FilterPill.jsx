/**
 * @file FilterPill.jsx
 * @description Grupo de filtros em pílula — estilo aba compacta, no padrão monospace do app.
 * Gerencia o estado ativo internamente ou de forma controlada via `value`/`onChange`.
 *
 * @module ui/FilterPill
 */

/**
 * @typedef {{ id: string, label: string }} FilterOption
 */

/**
 * Grupo de filtros em pílula.
 *
 * @param {object}         props
 * @param {FilterOption[]} props.options           - Lista de opções.
 * @param {string}         props.value             - ID da opção ativa (controlado).
 * @param {Function}       props.onChange          - `(id: string) => void`.
 * @param {string}         [props.className='']    - Classes extras no wrapper.
 *
 * @example
 * const FILTERS = [
 *   { id: 'all',     label: `Todas (${total})` },
 *   { id: 'due',     label: `Revisar (${dueCount})` },
 *   { id: 'learned', label: 'Aprendidas' },
 * ]
 *
 * <FilterPill options={FILTERS} value={filter} onChange={setFilter} />
 */
export default function FilterPill({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={[
            'px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-150 border',
            value === opt.id
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'text-chalk/30 hover:text-chalk/60 border-transparent',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
