/**
 * @file Button.jsx
 * @description Componente de botão genérico com variantes visuais e suporte a estado de loading.
 *
 * @module ui/Button
 */

/**
 * @typedef {'primary' | 'secondary' | 'ghost' | 'danger'} ButtonVariant
 *
 * - **primary**   → fundo âmbar, texto escuro. Ação principal da tela.
 * - **secondary** → borda + fundo escuro. Ação alternativa.
 * - **ghost**     → sem borda/fundo, só texto. Ações discretas (ex.: "← voltar").
 * - **danger**    → tons de vermelho. Ações destrutivas.
 */

/**
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 */

const VARIANTS = {
  primary:
    'bg-amber-500 hover:bg-amber-400 text-ink-950 font-semibold disabled:opacity-30',
  secondary:
    'border border-ink-600 bg-ink-800 hover:border-ink-500 text-chalk/60 hover:text-chalk/90',
  ghost:
    'text-chalk/30 hover:text-chalk/70',
  danger:
    'border border-red-800 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
}

/**
 * Botão de uso geral do app.
 *
 * @param {object}        props
 * @param {ButtonVariant} [props.variant='primary']  - Variante visual.
 * @param {ButtonSize}    [props.size='md']           - Tamanho do botão.
 * @param {boolean}       [props.loading=false]       - Mostra spinner e desabilita o botão.
 * @param {boolean}       [props.disabled=false]      - Desabilita o botão.
 * @param {boolean}       [props.fullWidth=false]     - Ocupa 100% da largura do container.
 * @param {string}        [props.className='']        - Classes Tailwind extras.
 * @param {Function}      [props.onClick]             - Callback de clique.
 * @param {React.ReactNode} props.children            - Conteúdo do botão.
 *
 * @example
 * // Botão primário com loading
 * <Button loading={isLoading} onClick={handleSubmit}>Gerar Frases →</Button>
 *
 * @example
 * // Botão ghost para navegação
 * <Button variant="ghost" onClick={onBack}>← voltar</Button>
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'font-sans transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
