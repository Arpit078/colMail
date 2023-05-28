const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const to = document.getElementById('to')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
let filePath
btn.addEventListener('click', async () => {
  const filePathvar = await window.electronAPI.openFile()
  console.log(filePathvar)
  filePath = filePathvar
})
async function sendDataAndWait(data) {
  await window.electronAPI.sendData(data);
  // Code that depends on the completion of sendData
}

send.addEventListener('click',async ()=>{
  const data = {
    to : to.value,
    subject:subject.value,
    message:message.value,
    fileName:filename.value,
    filePath : result = typeof filePath !== 'undefined' ? filePath : ""
  }
console.log(data)
await sendDataAndWait(data).then(
  window.electronAPI.handleMessage((event, value) => {console.log(value)})

)
})