//-----------------------------------------------------------------------//
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const to = document.getElementById('to')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
const mailBox = document.getElementById('mailBox')
const addReceipient = document.getElementById('add-receipient')
const mailCounterdiv = document.getElementById('mailCounter')
const inputContainer = document.getElementById('inputContainer');
const openPopupButton = document.getElementById('openPopupButton');
const closePopupButton = document.getElementById('closePopupButton');
const popupContainer = document.getElementById('popupContainer');
const variableInput = document.getElementById('variableInput');
const addVariableButton = document.getElementById('addButton');
const tabs = document.getElementById('tabs');
const emailTabBox = document.querySelector("#EmailTabBox")
var root = document.querySelector(':root');
//-----------------------------------------------------------------------//



 
let filePath
let recipientValuesGlobal = {}
let varObj





//-------------This block works on the mail analytics functions--------------------------//
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

// reminderCount(reminderCounterdiv)
updateCount(mailCounterdiv)
//---------------------------------------------------------------------------------------//











//------------------------Input Element addition and list locking------------------------//

function locklist(key){
  const InputsTab = document.querySelector(`#${key}TabBox`);
  const recipientInputs = InputsTab.querySelectorAll("input.receipient")
  const recipientValues = Array.from(recipientInputs).map(input => input.value);
  recipientValuesGlobal[key] = recipientValues
  
  return recipientValuesGlobal
}

//--------------------------------------------------------------------------------------//











//----------------------------Tabs add and visibility functionality-----------------------//
function addVariable() {
  const variableName = variableInput.value;
  popupContainer.style.display = 'none';
  console.log(`Variable Name: ${variableName}`);
  const length = getComputedStyle(root).getPropertyValue('--length')
  if(variableName.length > 6){
    root.style.setProperty("--length","5rem")
  }
  return variableName
}
openPopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'flex'
});

closePopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});


addVariableButton.addEventListener('click', ()=>{
  const varName = addVariable();
  const tab = document.createElement('button')
  tab.setAttribute(`id`,varName) 
  tab.setAttribute("class","tab")
  tab.innerText = varName
  tabs.appendChild(tab)
});

tabs.addEventListener('click', function(event) {
  // Check if the clicked element is an input element
  if (event.target.tagName === 'BUTTON') {
    const tabBoxes = document.querySelectorAll(".tabBox")
    tabBoxes.forEach((e)=>{
      e.style.display = "none"
    }
    )
    const focusTabBox = document.getElementById(`${event.target.id}TabBox`)
    focusTabBox.style.display = "block"
  }
});
//--------------------------------------------------------------------------------------------//











//------------------------------Data processing and sending the mail portion------------------//
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
//----------------------------------------------------------------------------------------------------------------------//