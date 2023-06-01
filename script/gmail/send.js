const fs = require('fs').promises;
const {google} = require('googleapis');
const {createEmlWithAttachment} = require('./eml.js')
const {authorize} = require('./auth.js');
const { file } = require('googleapis/build/src/apis/file/index.js');


async function updateData(label){
//   const datafilePath = "./script/gmail/data/sent.json"
//   try {
//     const data = await fs.readFile(datafilePath, 'utf8');
//     let jsonData = JSON.parse(data);
//     jsonData.push(label);
//     await fs.writeFile(datafilePath, JSON.stringify(jsonData, null, 2), 'utf8');
//   } catch (err) {
//     console.error('Error:', err);
//   }
} 
async function sendMailSingle(auth, recipient, subject, message, filename, path) {
  return new Promise(async (resolve, reject) => {
    try {
      const gmail = google.gmail({ version: 'v1', auth });
      const attachment = await createEmlWithAttachment(recipient, subject, message, filename, path);
      
      //-------------------drafting the mail.---------------------//
      const draftRes = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          id: "ID"
        },
        media: { mimeType: "message/rfc822", body: attachment },
      });
      
      //---------------lists out the drafted mails -------------//
      // const listRes = await gmail.users.drafts.list({
      //   userId: "me"
      // });
      
      //-----------------send a drafted mail with its uniquely created id by gmail.------------//
      // const sendRes = await gmail.users.drafts.send({
      //   userId: 'me',
      //   requestBody: {
      //     id: draftRes.data.id,
      //   }
      // });
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year}`; // 29-05-2023
      
      const labels = {
        date: formattedDate,
        recipient:recipient,
        subject:subject,
        data: draftRes.data
      };
      
      // console.log(labels);
      // await updateData(labels);
      await fs.unlink("./email.eml", () => { console.log("deleted email.eml"); });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/*
sample varObj =>
{
  Name : ["Arpit","Hrishita","Subham","Rimjhim"],
  Company : ["Arista","Oracle","Uber","Google"]
}

sample message =>
 `Hey ${Name}, I saw through ${Company}'s recent opening on linkedIn and wanted to apply. PFA my Resume.`

variableDataObj = 
{
  Company : "Oracle"
  Greeting : "Hola!",
  Name : "Arpit",
  fileName : "Resume"

}
variableNameObj
{
  subjectVar : ["Company","Greeting"],
  messageVar : ["Name"],
  filenameVar : ["fileName"],

}
*/

function replaceVariables(string, variables) {
  const regex = /\${(.*?)}/g;
  const replacedString = string.replace(regex, (match, variable) => {
    if (variables.hasOwnProperty(variable)) {
      return variables[variable];
    }
    return match; // Return the original match if the variable is not found
  });

  return replacedString;
}
function extractObjectWithIndex(obj, index) {
  const extractedObject = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && Array.isArray(obj[key]) && obj[key][index]) {
      extractedObject[key] = obj[key][index];
    }
  }

  return extractedObject;
}

async function messageFormatter(subject, message, fileName, variableDataObj) {
  subject = replaceVariables(subject, variableDataObj);
  message = replaceVariables(message, variableDataObj);
  fileName = replaceVariables(fileName, variableDataObj);
  const mailContent = { sub: subject, mes: message, file: fileName };
  return mailContent;
}


async function sendMail(recipientArr, subject, message, fileName, path, variableObj) {
  const auth = await authorize()
  for (let i = 0; i < recipientArr.length; i++) {
    const variableDataObj = extractObjectWithIndex(variableObj, i)
    console.log("\nvariableDataObj : ",variableDataObj)

    const mailContent = await messageFormatter(subject,message,fileName,variableDataObj)
    console.log("\nmailContent : ",mailContent)
    await sendMailSingle(auth, recipientArr[i], mailContent.sub, mailContent.mes, mailContent.file, path);
  }
  
  return 1;
}

sendMail(["verma.arpit078@gmail.com","blabbla429@gmail.com"],"${Greetings} ${Name}","Hey ${Name}, I saw through ${Company}'s recent opening on linkedIn and wanted to apply. PFA my Resume.","resume.pdf",``,{
  Greetings : ["Hey","Hola"],
  Name : ["Arpit","bla"],
  Company : ["Arista","Oracle"]
})


async function mailsToday(){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;//29-05-2023
  const data = await fs.readFile("./script/gmail/data/sent.json", 'utf8');
  let jsonData = JSON.parse(data);
  let count =0
  for(let i=0;i<jsonData.length;i++){
    if(jsonData[i].date===formattedDate){
      count+=1
    }
  }
  return count

}

module.exports = { sendMail,mailsToday }