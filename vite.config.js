import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig(async () => {
  // `@tailwindcss/vite` é ESM-only; carregar via import dinâmico evita erro de `require`.
  const tailwindcss = (await import('@tailwindcss/vite')).default

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    base: './',
    build: {
      outDir: 'dist',
    },
    server: {
      port: 8080,
      strictPort: true,
    },
  }
})
