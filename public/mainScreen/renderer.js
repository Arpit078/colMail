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
const mailCounterdiv = document.getElementById('mailCounter')
const reminderCounterdiv = document.getElementById('reminderCounter')
const refreshbtn = document.getElementById('refresh')
 
let filePath
let recipientValuesGlobal

async function updateCount(mailCounterdiv){
  const count = window.electronAPI.mailCount().then((res)=>{
    console.log(res)
    mailCounterdiv.innerHTML = res
    return res
  })  
  return count
}

async function reminderCount(reminderCounterdiv){
  const count = window.electronAPI.reminderCount().then((res)=>{
    console.log(res)
    reminderCounterdiv.innerHTML=res
    return res
  }) 
  return count 
}

updateCount(mailCounterdiv)
reminderCount(reminderCounterdiv)
/*
refreshbtn.addEventListener('click', ()=>{
    reminderCounterdiv.innerHTML =  reminderCount()
})
*/

async function sendDataAndWait(data) {
  return new Promise((resolve, reject) => {
    window.electronAPI.sendData(data, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

async function sendMailAndCount(data) {
  try {
    await sendDataAndWait(data);
    // updateCount(mailCounterdiv);
    console.log("added");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
addReceipient.addEventListener('click', ()=>{
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Receipient");
    inputElement.setAttribute("class", "receipient");
    mailBox.appendChild(inputElement);
   
})
// 

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


send.addEventListener('click',async ()=>{
    const data = {
      to : recipientValuesGlobal,
      subject:subject.value,
      message:message.value,
      fileName:filename.value,
      filePath : result = typeof filePath !== 'undefined' ? filePath : ""
    }
    console.log(data)
    sendMailAndCount(data);
  
})