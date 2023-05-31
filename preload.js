const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  sendData: (data) => ipcRenderer.send('receiveData', data),
  handleMessage: (callback) => ipcRenderer.on('message-sent', callback),
  mailCount : ()=>  ipcRenderer.invoke('mail-count'),
  reminderCount : ()=>  ipcRenderer.invoke('reminder-count')
})