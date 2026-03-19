import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ErrorBanner, TextInput } from './ui'
import { authRegister } from '../utils/authApi'
import { storage } from '../utils/storage'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)
    try {
      const res = await authRegister(email, password)
      storage.setSession(res.token, res.user)
      navigate('/app/generate', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade-up">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">
            +
          </div>
          <h1 className="mt-5 font-display text-4xl text-chalk">
            Criar <span className="text-amber-400 italic">Conta</span>
          </h1>
          <p className="mt-2 text-chalk/35 font-mono text-xs tracking-wider uppercase">
            Email e senha · Sessão local
          </p>
        </div>

        <div className="space-y-4">
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            disabled={loading}
          />

          <TextInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="mínimo 8 caracteres"
            disabled={loading}
          />

          <TextInput
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="repita a senha"
            disabled={loading}
          />

          <ErrorBanner message={error} />

          <Button fullWidth size="lg" loading={loading} onClick={handleRegister}>
            Criar conta →
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-chalk/25">
            <span>Já tem conta?</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-amber-400/80 hover:text-amber-300 transition-colors"
              disabled={loading}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
