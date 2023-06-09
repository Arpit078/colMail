//-----------------------------------------------------------------------//
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const subject = document.getElementById('subject')
const message = document.getElementById('message')
const send = document.getElementById('send')
const filename = document.getElementById('filename')
const mailBox = document.getElementById('mailBox')
const mailCounterdiv = document.getElementById('mailCounter')
const inputContainer = document.getElementById('inputContainer');
//-----------------------------------------------------------------------//



 
let filePath = []
let excelFilePath
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





//-----------------------------importing from excel sheets------------------------------//

const importBtn = document.querySelector("#import-list")
importBtn.addEventListener('click', async () => {
  const filePathvar = await window.electronAPI.openFile()
  console.log(filePathvar)
  excelFilePath =  filePathvar
  if(filePathvar!=""){
    
 
  importBtn.innerText = "Import Another File"
  const fileBox = document.querySelector("#recipientFile")
  const fileName = filePathvar.split('\\').pop();
  fileBox.innerHTML =`<div class="fileOutlineRecipient">
  <span class="fileName">${fileName}</span>
</div>`
    if(message.value!=""&&subject.value!=""){
      send.style.cursor = "pointer"
      send.style.backgroundColor = "#ADD8E6"
      send.innerText = "Send"
      send.disabled = false
    }
}})

//-------------------------------------------------------------------------------------//















//------------------------------verification--------------------------------------------------//
function verifyArrays(recipientValuesGlobalArr,varsGlobalObj,subject,message){
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
  if(subject===""){
    flag=0;
  }
  if(message===""){
    flag=0;
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


// async function sendDataAndWait(data) {
//   return new Promise((resolve, reject) => {
//     window.electronAPI.sendData(data, (error, res) => {
//       if (error) {
//         reject(error);
//       } else {
//         console.log(res)
//         resolve(res);
//       }
//     });
//   });
// }

async function sendMailAndCount(data) {
  try {
    await window.electronAPI.sendData(data);
    await window.electronAPI.handleMessage((evt,value)=>{
      console.log(value)
      // send.setAttribute("class","sendPending")
      send.innerText = "Sent"
      send.style.cursor = "not-allowed"
      send.style.backgroundColor = "#33323590"
      send.style.color = "rgb(36, 35, 35)"
      send.disabled = true;

    })
    // updateCount(mailCounterdiv);
    console.log("added");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

btn.addEventListener('click', async () => {
  const filePathvar = await window.electronAPI.openFile()
  // console.log(filePathvar)
  const fileBox = document.querySelector("#file")
  const file = document.createElement("div")
  const fileName = filePathvar.split('\\').pop();
  file.innerHTML =`<div class="fileOutline">
  <span class="fileName">${fileName}</span>
</div>`
  fileBox.appendChild(file)
  btn.innerText = "Attach more files."
  filePath.push(filePathvar)
  console.log(filePath)
})


send.addEventListener('click',async ()=>{
  if(verifyArrays(recipientValuesGlobalArr,varsGlobalObj,subject.value,message.value)==1){
    const sendArray = processSentArrays(recipientValuesGlobalArr,varsGlobalObj)
    console.log(sendArray)
    const data = {
        subject:subject.value,
        message:message.value,
        filePath : filePath,
        xlsxPath : excelFilePath || ""
      }
      console.log(data)
      sendMailAndCount(data);
      send.setAttribute("class","sendOk")
      send.innerText="Sending"

  }
  
  
})
//----------------------------------------------------------------------------------------------------------------------//