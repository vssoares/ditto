import { useEffect, useState } from 'react'

type UpdateState =
  | { status: 'idle' }
  | { status: 'available'; version: string }
  | { status: 'downloading'; percent: number }
  | { status: 'downloaded' }
  | { status: 'error'; message: string }

export default function UpdateBanner() {
  const [update, setUpdate] = useState<UpdateState>({ status: 'idle' })

  useEffect(() => {
    if (!window.electronAPI?.update) return

    window.electronAPI.update.onAvailable((info: { version: string }) =>
      setUpdate({ status: 'available', version: info.version })
    )
    window.electronAPI.update.onProgress((p: { percent: number }) =>
      setUpdate({ status: 'downloading', percent: Math.floor(p.percent) })
    )
    window.electronAPI.update.onDownloaded(() => setUpdate({ status: 'downloaded' }))
    window.electronAPI.update.onError((msg: string) => setUpdate({ status: 'error', message: msg }))
  }, [])

  if (update.status === 'idle' || update.status === 'error') return null

  return (
    <div className="relative z-50 flex items-center justify-between px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-400/90">
      {update.status === 'available' && (
        <>
          <span>Nova versão disponível: <strong>{update.version}</strong></span>
          <button
            onClick={() => window.electronAPI.update?.download()}
            className="ml-4 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 transition-colors font-mono"
          >
            Baixar
          </button>
        </>
      )}

      {update.status === 'downloading' && (
        <>
          <span>Baixando atualização...</span>
          <span className="font-mono">{update.percent}%</span>
        </>
      )}

      {update.status === 'downloaded' && (
        <>
          <span>Atualização pronta para instalar</span>
          <button
            onClick={() => window.electronAPI.update?.install()}
            className="ml-4 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 transition-colors font-mono"
          >
            Reiniciar e instalar
          </button>
        </>
      )}
    </div>
  )
}
