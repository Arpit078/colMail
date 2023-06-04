//-----------------------------------------------------------------------//
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
const mailBox = document.getElementById('mailBox')
const addReceipientBtn = document.getElementById('add-receipient')
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
let recipientValuesGlobalArr = []
let varsGlobalObj = {}





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







//---------------enter key button events---------------------

document.addEventListener("keydown", evt => {
  if (evt.key === "Enter" && evt.target.classList.contains("recipient")) {
    evt.preventDefault();
    const tabBox = evt.target.closest('.tabBox');
     
    const inputElements = tabBox.querySelectorAll('input');
    const index = Array.from(inputElements).indexOf(evt.target);

    const TabDivThatIsEmailOrOther = evt.target.parentNode.parentNode.parentNode
    if(evt.target.value.length>0 && TabDivThatIsEmailOrOther.id === "EmailTabBox"){
      recipientValuesGlobalArr.push([evt.target.value,index])
      evt.target.style.backgroundColor = "lightBlue"
    }
    else if(evt.target.value.length>0 && TabDivThatIsEmailOrOther.id != "EmailTabBox"){
      const KeyNameInVarObj = TabDivThatIsEmailOrOther.id.replace("TabBox","")
      varsGlobalObj[KeyNameInVarObj].push([evt.target.value,index]) 
      evt.target.style.backgroundColor = "lightBlue"
    }
    
  }
});
//--------------------------------------------------------------------------------------------//






//------------------------Input Element addition and Removal------------------------//

function countNumberOfInputsInEmailTab(){
  const count = document.getElementById("inputContainer").querySelectorAll(".inputBox").length
  return count
}

function addInputElementsInAllTabsTogether(){
  const inputDivsFromAllTabs = document.querySelectorAll(".inputs")
  inputDivsFromAllTabs.forEach((input)=>{
    const inputTagAndButtonDiv = document.createElement("div")
    inputTagAndButtonDiv.classList.add("inputBox")
    inputTagAndButtonDiv.innerHTML = `<input type="text" placeholder="Recipient" class="recipient">
    <button>x</button>`
    input.appendChild(inputTagAndButtonDiv)
  })
}

function removeInputElementInAllTabsTogether(){
  const inputDivsFromAllTabs = document.querySelectorAll(".inputs")
  inputDivsFromAllTabs.forEach((input)=>{
   
  })
}

addReceipientBtn.addEventListener("click",addInputElementsInAllTabsTogether)

//------------------------------------------------------------------------------------//
// Add event listener to the document using event delegation
document.addEventListener("click", function(event) {
  var target = event.target;

  // Check if the clicked element is the close button
  if (target.tagName === "BUTTON") {
    // Find all tabBox containers
    var tabBoxes = document.querySelectorAll(".tabBox");

    // Loop through each tabBox containe
    let index = 0
    tabBoxes.forEach((tabBox)=>{
      const inputElements = tabBox.querySelectorAll('button');
      index = Array.from(inputElements).indexOf(target);
    })
    tabBoxes.forEach((tabBox)=>{
      const inputBoxes = tabBox.querySelectorAll(".inputBox")
      inputBoxes[index].remove()  
    })
  }
});











//----------------------------Tabs Addition and visibility functionality-----------------------//
function addVariable() {
  const variableName = variableInput.value.replace(/ /g,'_');
  popupContainer.style.display = 'none';
  const length = getComputedStyle(root).getPropertyValue('--length')
  if(variableName.length > 6){
    root.style.setProperty("--length","5rem")
  }
  varsGlobalObj[variableName] = []
  return variableName
}
openPopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'flex'
});

closePopupButton.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});

function addInputSkeletonInNewTab(id){
  const newTabSkeleton = document.createElement("div")
  newTabSkeleton.classList.add("tabBox")
  newTabSkeleton.setAttribute("id",`${id}TabBox`)
  newTabSkeleton.innerHTML = 
  `
  <div class="inputs">
  </div>
  `
  mailBox.appendChild(newTabSkeleton)
}
addVariableButton.addEventListener('click', ()=>{
  const varName = addVariable();
  const tab = document.createElement('button')
  tab.setAttribute(`id`,varName) 
  tab.setAttribute("class","tab")
  tab.innerText = varName
  tabs.appendChild(tab)
  addInputSkeletonInNewTab(varName)
    const countOfEmailTab = countNumberOfInputsInEmailTab()
    inputTagAndButtonDivForOtherTabBoxesHTML = `<div class="inputBox">
    <input type="text" placeholder="Recipient" class="recipient">
    <button>x</button>
  </div>`
    for(let i=1;i<countOfEmailTab;i++){
      inputTagAndButtonDivForOtherTabBoxesHTML += `<div class="inputBox">
      <input type="text" placeholder="Recipient" class="recipient">
      <button>x</button>
    </div>`
    }
    document.querySelector(`#${varName}TabBox`).querySelector(".inputs").innerHTML = inputTagAndButtonDivForOtherTabBoxesHTML
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



//------------------------------verification--------------------------------------------------//
function verifyArrays(recipientValuesGlobalArr,varsGlobalObj){
  const lengthOfRecipientArr = recipientValuesGlobalArr.length
  let varObjLengthArr = []
  for(var key in varsGlobalObj){
    varObjLengthArr.push(varsGlobalObj[key].length)
  }
  let flag = 1
  if(varObjLengthArr.length>0){
    varObjLengthArr.forEach((len)=>{
      if(len!=lengthOfRecipientArr){flag =0}
    })
  }
  return flag
}

//-------------------------------------------------------------------------------------------//


//------------------------------Data processing and sending the mail portion------------------//

function processSentArrays(arr, obj) {
  const sortedArray = arr.sort((a, b) => a[1] - b[1]);
  const finalArr = sortedArray.map(item => item[0]);

  const finalObj = {};
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const sortedSubarray = obj[prop].sort((a, b) => a[1] - b[1]);
      const finalSubarray = sortedSubarray.map(item => item[0]);
      finalObj[prop] = finalSubarray;
    }
  }

  // console.log(finalObj);
  const result = [finalArr, finalObj];
  return result;
}

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
  if(verifyArrays(recipientValuesGlobalArr,varsGlobalObj)==1){
    const sendArray = processSentArrays(recipientValuesGlobalArr,varsGlobalObj)
    console.log(sendArray)
    const data = {
        to : sendArray[0],
        subject:subject.value,
        message:message.value,
        fileName:filename.value,
        filePath : result = typeof filePath !== 'undefined' ? filePath : "",
        variableObj : sendArray[1]
      }
      console.log(data)
      sendMailAndCount(data);
  }
  
  
})
//----------------------------------------------------------------------------------------------------------------------//