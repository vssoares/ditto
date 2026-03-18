/**
 * @file StatCard.jsx
 * @description Card de estatística — exibe um valor numérico em destaque com uma label abaixo.
 * Usado na tela de conclusão de sessão de estudo.
 *
 * @module ui/StatCard
 */

/**
 * Card de métrica/estatística.
 *
 * @param {object} props
 * @param {string|number} props.value       - Valor principal exibido em destaque.
 * @param {string}        props.label       - Rótulo descritivo abaixo do valor.
 * @param {string}        [props.color='text-chalk'] - Classe de cor Tailwind para o valor.
 * @param {string}        [props.className='']       - Classes extras.
 *
 * @example
 * <StatCard value={stats.easy} label="Fácil"   color="text-green-400" />
 * <StatCard value={stats.hard} label="Difícil" color="text-orange-400" />
 */
export default function StatCard({ value, label, color = 'text-chalk', className = '' }) {
  return (
    <div className={`bg-ink-800 border border-ink-600 rounded-xl p-3 text-center ${className}`}>
      <div className={`font-display text-2xl ${color}`}>{value}</div>
      <div className="font-mono text-xs text-chalk/30 mt-0.5">{label}</div>
    </div>
  )
}
