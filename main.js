const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const {sendMail,mailsToday} = require("./script/gmail/send.js")
const {reminder} = require("./script/gmail/reminder.js")
const {readExcel} = require("./script/gmail/readExcel.js")

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  ipcMain.on('receiveData', async (event, data) => {
    const webContents = event.sender;
    try {
      // const res = await authorize();
      await sendMail(data.subject,data.message, data.filePath,data.xlsxPath);
      webContents.send('message-sent', "All Mails sent successfully");
      // console.log("Final message ==> Mail sent successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
  
  mainWindow.loadFile('./public/mainScreen/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('mail-count',mailsToday)
  ipcMain.handle('reminder-count',reminder)
  // ipcMain.handle('receiveData',sendMail)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})