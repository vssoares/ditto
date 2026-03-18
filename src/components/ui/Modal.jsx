/**
 * @file Modal.jsx
 * @description Modal genérico com overlay escuro, painel central animado e botão de fechar.
 * Suporta fechamento ao clicar no overlay ou pressionar Escape.
 *
 * @module ui/Modal
 */

import { useEffect } from 'react'

/**
 * Modal de sobreposição genérico.
 *
 * @param {object}          props
 * @param {boolean}         props.open             - Controla visibilidade do modal.
 * @param {Function}        props.onClose          - Chamado ao fechar (overlay, Escape ou botão ✕).
 * @param {string}          [props.title]          - Título exibido no header do painel.
 * @param {string}          [props.maxWidth='md']  - Largura máxima: 'sm' | 'md' | 'lg'.
 * @param {boolean}         [props.showClose=true] - Exibe botão ✕ no header.
 * @param {React.ReactNode} props.children         - Conteúdo interno do painel.
 *
 * @example
 * <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Configurações">
 *   <p>Conteúdo do modal</p>
 * </Modal>
 */
export default function Modal({ open, onClose, title, maxWidth = 'md', showClose = true, children }) {
  // Fecha ao pressionar Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-ink-800 border border-ink-600 rounded-2xl p-8 w-full ${widths[maxWidth]} animate-fade-up shadow-2xl`}
        onClick={(e) => e.stopPropagation()} // impede fechar ao clicar dentro do painel
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h2 className="font-display text-2xl text-chalk">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ink-700 text-chalk/40 hover:text-chalk/80 transition-colors ml-auto"
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
