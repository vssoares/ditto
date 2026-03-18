import { useState } from 'react'
import { storage } from '../utils/storage'
import { Modal, TextInput, Button } from './ui'

/**
 * Modal de configurações do app.
 * Permite ao usuário inserir e salvar a OpenAI API Key localmente.
 *
 * @param {object}   props
 * @param {Function} props.onClose - Chamado ao fechar o modal.
 */
export default function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState(storage.getApiKey())
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    storage.setApiKey(apiKey.trim())
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  return (
    <Modal open onClose={onClose} title="Configurações">
      <div className="space-y-4">
        <TextInput
          label="OpenAI API Key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          hint="Sua chave é salva apenas localmente no seu computador."
        />

        <Button
          fullWidth
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className={saved ? '!bg-green-800 !text-green-300' : ''}
        >
          {saved ? '✓ Salvo!' : 'Salvar'}
        </Button>
      </div>
    </Modal>
  )
}
