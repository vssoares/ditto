/**
 * @file EmptyState.jsx
 * @description Estado vazio genérico — exibido quando uma lista não tem itens.
 * Centraliza ícone, título e descrição na área disponível.
 *
 * @module ui/EmptyState
 */

/**
 * Exibição de estado vazio para listas e coleções.
 *
 * @param {object} props
 * @param {string} [props.icon='📭']      - Emoji ou ícone exibido acima do título.
 * @param {string} props.title            - Título principal.
 * @param {string} [props.description]    - Texto explicativo secundário.
 * @param {React.ReactNode} [props.action] - Elemento de ação (ex.: botão "Criar primeiro item").
 * @param {string} [props.className='']   - Classes extras.
 *
 * @example
 * <EmptyState
 *   icon="📚"
 *   title="Biblioteca vazia"
 *   description="Gere frases para começar a estudar"
 * />
 *
 * @example
 * // Com botão de ação
 * <EmptyState
 *   icon="📭"
 *   title="Nenhum item"
 *   action={<Button onClick={handleCreate}>Criar primeiro</Button>}
 * />
 */
export default function EmptyState({ icon = '📭', title, description, action, className = '' }) {
  return (
    <div className={`flex-1 flex items-center justify-center animate-fade-in ${className}`}>
      <div className="text-center space-y-3">
        <p className="text-4xl">{icon}</p>
        <p className="font-display text-2xl text-chalk/60">{title}</p>
        {description && (
          <p className="font-mono text-xs text-chalk/30">{description}</p>
        )}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
}
