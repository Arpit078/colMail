const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const to = document.getElementById('to')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
const addReceipient = document.getElementById('add-receipient')
const mailBox = document.getElementById('mailBox')
const lockList = document.getElementById('lock-list')
let filePath
let recipientValuesGlobal

addReceipient.addEventListener('click', ()=>{
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Receipient");
    inputElement.setAttribute("class", "receipient");
    mailBox.appendChild(inputElement);
   
})

lockList.addEventListener('click',()=>{
  const recipientInputs = document.querySelectorAll('input.receipient');
  const recipientValues = Array.from(recipientInputs).map(input => input.value);
  recipientValuesGlobal = recipientValues
  console.log(recipientValuesGlobal)
})


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
      to : recipientValuesGlobal,
      subject:subject.value,
      message:message.value,
      fileName:filename.value,
      filePath : result = typeof filePath !== 'undefined' ? filePath : ""
    }
    console.log(data)
    await sendDataAndWait(data).then(
      window.electronAPI.handleMessage((event, value) => {console.log(value)}))
})