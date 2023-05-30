const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const {sendMail,authorize,mailsToday} = require("./script/gmail/send.js")

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })
  ipcMain.on('receiveData', async (event, data) => {
    const webContents = event.sender;
    try {
      // const res = await authorize();
      await sendMail(data.to, data.subject, data.message, data.fileName, data.filePath);
      webContents.send('message-sent', 1);
      console.log("Mail sent successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
  
  mainWindow.loadFile('./public/mainScreen/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('mail-count',mailsToday)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})