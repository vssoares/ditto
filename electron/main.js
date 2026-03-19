const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')

const isDev = !app.isPackaged

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

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
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update:checking')
  })

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update:available', info)
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update:not-available')
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('update:progress', progress)
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update:downloaded')
  })

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update:error', err.message)
  })
}

app.whenReady().then(() => {
  createWindow()

  if (!isDev) {
    setupAutoUpdater()
    setTimeout(() => autoUpdater.checkForUpdates(), 3000)
  }
})

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

// Auto-update controls
ipcMain.handle('update:download', () => autoUpdater.downloadUpdate())
ipcMain.handle('update:install', () => {
  autoUpdater.quitAndInstall()
})

// const BACKEND_URL = 'http://localhost:3000
const BACKEND_URL = 'http://scssgw80csoo8wg440ks8csg.86.48.22.217.sslip.io'

// Generate phrases via backend
ipcMain.handle('generate-phrases', async (_event, { topic, level, count }) => {
  try {
    console.log(`${BACKEND_URL}/phrases`);
    
    const response = await fetch(`${BACKEND_URL}/phrases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level, count }),
    })

    if (!response.ok) {
      const text = await response.text()
      return { success: false, error: `Erro ${response.status}: ${text}` }
    }

    const data = await response.json()
    return { success: true, phrases: data.phrases }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
