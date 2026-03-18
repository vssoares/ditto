import { useState } from 'react'
import { storage } from '../utils/storage'
import { Modal, TextInput, Button } from './ui'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
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
