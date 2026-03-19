/// <reference types="vite/client" />

interface ElectronGenerateParams {
  topic: string
  level: string
  count: number
}

interface ElectronGenerateResult {
  success: boolean
  error?: string
  phrases?: Array<{
    english: string
    portuguese: string
    tip?: string
    keywords?: string[]
  }>
}

interface ElectronUpdateAPI {
  onChecking: (cb: () => void) => void
  onAvailable: (cb: (info: { version: string }) => void) => void
  onNotAvailable: (cb: () => void) => void
  onProgress: (cb: (progress: { percent: number }) => void) => void
  onDownloaded: (cb: () => void) => void
  onError: (cb: (message: string) => void) => void
  download: () => Promise<void>
  install: () => Promise<void>
}

declare const __APP_VERSION__: string

interface ElectronAPI {
  generatePhrases: (params: ElectronGenerateParams) => Promise<ElectronGenerateResult>
  minimizeWindow?: () => void
  maximizeWindow?: () => void
  closeWindow?: () => void
  update?: ElectronUpdateAPI
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
