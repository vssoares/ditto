const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0908',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Window controls
ipcMain.on('window-minimize', () => mainWindow.minimize())
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize()
  else mainWindow.maximize()
})
ipcMain.on('window-close', () => mainWindow.close())

// OpenAI integration
ipcMain.handle('generate-phrases', async (_event, { apiKey, topic, level, count }) => {
  try {
    // Dynamic import to handle ESM module
    const { OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey })

    const levelMap = {
      beginner: 'A1/A2 (básico)',
      intermediate: 'B1/B2 (intermediário)',
      advanced: 'C1/C2 (avançado)',
    }

    const prompt = `Gere exatamente ${count} frases em inglês para aprendizado.

Nível: ${levelMap[level] || level}
Tópico: ${topic}

Retorne um JSON com a chave "phrases" contendo um array de objetos:
{
  "phrases": [
    {
      "english": "a frase em inglês",
      "portuguese": "a tradução em português brasileiro",
      "tip": "uma dica curta sobre gramática ou vocabulário (em português)",
      "keywords": ["palavra1", "palavra2"]
    }
  ]
}

Regras:
- Frases naturais e do uso cotidiano real
- Traduções precisas em português brasileiro
- Dicas práticas e relevantes
- 2-3 keywords por frase
- Retorne APENAS o JSON`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    const parsed = JSON.parse(content)
    const phrases = parsed.phrases || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0])

    return { success: true, phrases }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
