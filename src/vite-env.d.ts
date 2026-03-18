/// <reference types="vite/client" />

interface ElectronGenerateParams {
  apiKey: string
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

interface ElectronAPI {
  generatePhrases: (params: ElectronGenerateParams) => Promise<ElectronGenerateResult>
  minimizeWindow?: () => void
  maximizeWindow?: () => void
  closeWindow?: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
