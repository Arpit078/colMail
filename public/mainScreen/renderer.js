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
const reminderCounterdiv = document.getElementById('reminderCounter')
const refreshbtn = document.getElementById('refresh')
const minimize = document.getElementById('minimize')
const icons = document.querySelectorAll('.icon')
const menuBox = document.getElementById('menu')
const expanded = document.querySelectorAll('.expanded');
const items = document.querySelectorAll('.item');
const inputContainer = document.getElementById('inputContainer');
const openPopupButton = document.getElementById('openPopupButton');
const closePopupButton = document.getElementById('closePopupButton');
const popupContainer = document.getElementById('popupContainer');
const variableInput = document.getElementById('variableInput');
const addButton = document.getElementById('addButton');
const tabs = document.getElementById('tabs');
const emailTabBox = document.querySelector("#EmailTabBox")

var root = document.querySelector(':root');


 
let filePath
let recipientValuesGlobal = {}

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

function locklist(key){
  const InputsTab = document.querySelector(`#${key}TabBox`);
  const recipientInputs = InputsTab.querySelectorAll("input.receipient")
  const recipientValues = Array.from(recipientInputs).map(input => input.value);
  recipientValuesGlobal[key] = recipientValues
  
  return recipientValuesGlobal
}
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
//------------------------------button functions--------------------------------------------------------------
openPopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'flex'
});

closePopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});


addButton.addEventListener('click', ()=>{
  const varName = addVariable();
  const tab = document.createElement('button')
  const inputElement = document.createElement('div')
  tab.setAttribute(`id`,varName) 
  tab.setAttribute("class","tab")
  tab.innerText = varName
  inputElement.classList.add("hidden")
  inputElement.classList.add("tabBox")
  inputElement.setAttribute("id",`${varName}TabBox`)
  console.log(inputElement)
  inputElement.innerHTML = 
  `
  <div class="inputs" >
    <div class="inputBox">
      <input type="text" placeholder="Recipient" class="receipient" id=${varName}>
      <button>x</button>
    </div>
  </div>
  `
  tabs.appendChild(tab)
  mailBox.appendChild(inputElement)
});

let initialInputCountInEmailTab = 1
addReceipient.addEventListener('click', ()=>{
  const inputs = document.querySelectorAll(".inputs")
  inputs.forEach((input)=>{
    const inputBoxElement = document.createElement("div")
    inputBoxElement.innerHTML = `
    <input type="text" placeholder="Recipient" class="receipient">
    <button>x</button>
  `;
    if(input.id==="inputContainer"){
      initialInputCountInEmailTab += 1
      input.appendChild(inputBoxElement)
    }
    if(input.id!=="inputContainer"){
      const inputTabNotEmailDivCount = input.querySelectorAll(".inputBox").length
      while(inputTabNotEmailDivCount != initialInputCountInEmailTab){
        input.appendChild(inputBoxElement)
        inputTabNotEmailDivCount +=1
      }
    }

    const parentElementID = input.parentNode.id;
    const slicedId= parentElementID.replace(/TabBox/g, '');
    console.log(slicedId)
    const inputElement = inputBoxElement.querySelector(".receipient")
    inputElement.focus()
    const emailObj = locklist(slicedId)
    var newObj = {};
    for (var key in emailObj) {
      if (emailObj.hasOwnProperty(key)) {
        newObj[key] = emailObj[key].filter(function(value) {
          return value !== "";
        });
      }
    }
    recipientValuesGlobal = newObj
    varObj = newObj
    console.log(recipientValuesGlobal)
  })
    
})
document.addEventListener("keydown", evt => {
  if (evt.key === "Enter" && evt.target.classList.contains("receipient")) {
    evt.preventDefault();
    console.log("hello")
    if (addReceipient) {
      addReceipient.click();
      evt.target.style.backgroundColor = "lightBlue"
    }
  }
});

// Get the parent container element

// Add a click event listener to the parent container
const inputs = document.querySelectorAll(".inputs")
inputs.forEach((input)=>{
    input.addEventListener('click', function(event) {
      // Check if the clicked element is an input element
      if (event.target.tagName === 'INPUT') {
        // Change the CSS property
        event.target.style.backgroundColor = '';
      }
      if (event.target.tagName === 'BUTTON') {
        // Get the parent element to be removed
        const parentElement = event.target.parentNode;
        console.log(parentElement)
        const inputElement = parentElement.querySelector(".receipient")
        const elementToRemove = inputElement.value
        recipientValuesGlobal = recipientValuesGlobal.filter((element) => element !== elementToRemove);
        console.log(recipientValuesGlobal)
        // Remove the parent element
        parentElement.remove();
      }
    });
  })
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


btn.addEventListener('click', async () => {
  const filePathvar = await window.electronAPI.openFile()
  console.log(filePathvar)
  filePath = filePathvar
})


send.addEventListener('click',async ()=>{
  delete varObj["Email"]
  const data = {
      to : recipientValuesGlobal.Email,
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