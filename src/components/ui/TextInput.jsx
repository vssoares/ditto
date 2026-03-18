/**
 * @file TextInput.jsx
 * @description Campo de texto genérico com label integrada, suporte a tipo password
 * (botão show/hide), mensagem de hint e estado de erro.
 *
 * @module ui/TextInput
 */

import { useState } from 'react'
import Label from './Label'

/**
 * Input de texto estilizado.
 *
 * @param {object}   props
 * @param {string}   [props.label]           - Label exibida acima do input.
 * @param {string}   [props.hint]            - Texto de dica exibido abaixo do input.
 * @param {string}   [props.error]           - Mensagem de erro (borda vermelha + texto).
 * @param {string}   [props.placeholder]     - Placeholder do input.
 * @param {string}   props.value             - Valor controlado.
 * @param {Function} props.onChange          - Callback `(e) => void`.
 * @param {'text'|'password'|'email'} [props.type='text'] - Tipo do input. Se 'password',
 *   exibe automaticamente o botão de toggle show/hide.
 * @param {boolean}  [props.disabled=false]  - Desabilita o campo.
 * @param {string}   [props.className='']    - Classes extras no wrapper.
 *
 * @example
 * <TextInput
 *   label="OpenAI API Key"
 *   type="password"
 *   value={apiKey}
 *   onChange={(e) => setApiKey(e.target.value)}
 *   hint="Salvo apenas localmente no seu computador."
 *   placeholder="sk-..."
 * />
 */
export default function TextInput({
  label,
  hint,
  error,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <Label className="mb-2">{label}</Label>}

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'w-full bg-ink-900 border rounded-xl px-4 py-3 text-chalk font-mono text-sm outline-none transition-colors',
            isPassword ? 'pr-14' : '',
            error
              ? 'border-red-700 focus:border-red-500'
              : 'border-ink-600 focus:border-amber-500',
            disabled ? 'opacity-40 cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-chalk/30 hover:text-chalk/70 transition-colors font-mono text-xs"
          >
            {showPassword ? 'hide' : 'show'}
          </button>
        )}
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-xs text-chalk/30">{hint}</p>
      )}
    </div>
  )
}
