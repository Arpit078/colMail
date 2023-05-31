const fs = require('fs').promises;
const {google} = require('googleapis');
const {createEmlWithAttachment} = require('./eml.js')
const {authorize} = require('./auth.js')


async function updateData(label){
  const datafilePath = "./script/gmail/data/sent.json"
  try {
    const data = await fs.readFile(datafilePath, 'utf8');
    let jsonData = JSON.parse(data);
    jsonData.push(label);
    await fs.writeFile(datafilePath, JSON.stringify(jsonData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error:', err);
  }
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
      const sendRes = await gmail.users.drafts.send({
        userId: 'me',
        requestBody: {
          id: draftRes.data.id,
        }
      });
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year}`; // 29-05-2023
      
      const labels = {
        date: formattedDate,
        recipient:recipient,
        subject:subject,
        data: sendRes.data
      };
      
      console.log(labels);
      await updateData(labels);
      await fs.unlink("./email.eml", () => { console.log("deleted email.eml"); });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function sendMail(recipientArr, subject, message, fileName, path) {
  const auth = await authorize()
  for (let i = 0; i < recipientArr.length; i++) {
    await sendMailSingle(auth, recipientArr[i], subject, message, fileName, path);
  }
  
  return 1;
}



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