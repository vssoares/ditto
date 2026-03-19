const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  update: {
    onChecking: (cb) => ipcRenderer.on('update:checking', cb),
    onAvailable: (cb) => ipcRenderer.on('update:available', (_e, info) => cb(info)),
    onNotAvailable: (cb) => ipcRenderer.on('update:not-available', cb),
    onProgress: (cb) => ipcRenderer.on('update:progress', (_e, progress) => cb(progress)),
    onDownloaded: (cb) => ipcRenderer.on('update:downloaded', cb),
    onInstalling: (cb) => ipcRenderer.on('update:installing', cb),
    onError: (cb) => ipcRenderer.on('update:error', (_e, msg) => cb(msg)),
    download: () => ipcRenderer.invoke('update:download'),
    install: () => ipcRenderer.invoke('update:install'),
  },
})
