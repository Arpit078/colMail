const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const to = document.getElementById('to')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
const mailBox = document.getElementById('mailBox')
const addReceipient = document.getElementById('add-receipient')
const lockList = document.getElementById('lock-list')
const mailCounterdiv = document.getElementById('mailCounter')
const reminderCounterdiv = document.getElementById('reminderCounter')
const refreshbtn = document.getElementById('refresh')
const minimize = document.getElementById('minimize')
const icons = document.querySelectorAll('.icon')
const menuBox = document.getElementById('menu')
const expanded = document.querySelectorAll('.expanded');
const items = document.querySelectorAll('.item');



 
let filePath
let recipientValuesGlobal
let varObj


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
// reminderCount(reminderCounterdiv)
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

function locklist(){
  const recipientInputs = document.querySelectorAll('input.receipient');
  const recipientValues = Array.from(recipientInputs).map(input => input.value);
  recipientValuesGlobal = recipientValues
  console.log(recipientValuesGlobal)
}
//------------------------------button functions--------------------------------------------------------------

addReceipient.addEventListener('click', ()=>{
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", "Recipient");
    inputElement.setAttribute("class", "receipient");
    mailBox.appendChild(inputElement);
    locklist()
})

const recipientInputs = document.querySelectorAll('input.receipient');
recipientInputs.forEach((input)=>{
  input.addEventListener("onkeydown",(evt)=>{
    if (evt.key === "enter") {
      // Cancel the default action, if needed
      evt.preventDefault();
      // Trigger the button element with a click
      addReceipient.click()
    }
  })
})


items.forEach((item)=>{
  item.addEventListener('click',()=>{
    minimize.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg>`
    menuBox.style.width = "15%"
    expanded.forEach(box => {
      box.style.display = 'block';
    });
  })
})

lockList.addEventListener('click',()=>{
  
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
      filePath : result = typeof filePath !== 'undefined' ? filePath : "",
      vaiableObj : varObj
    }
    console.log(data)
    sendMailAndCount(data);
  
})
//-----------------------------------------------------------------------------------------------------------------------