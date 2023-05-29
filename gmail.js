const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const {createEmlWithAttachment} = require('./emlGenerator.js')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/',
'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
'https://www.googleapis.com/auth/gmail.compose',
'https://www.googleapis.com/auth/gmail.modify',];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), './sensitive/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './sensitive/credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

//-------edit this block for custom mail and recipient---------//
// const recipient = "verma.arpit078@gmail.com"
// const subject = "Regarding this mails's visibility"
// const message = "I would like to know if this mail is visible in the regular inbox, feel free to reply with the status."
//--------------------------------------------------------------//





async function sendMailSingle(auth,recipient,subject,message,filename,path) {
  const gmail = google.gmail({version: 'v1', auth});
  const attachment = await createEmlWithAttachment(recipient,subject,message,filename,path)
//-------------------drafting the mail.---------------------//
  const draftRes = await gmail.users.drafts.create({
    userId:'me',
    requestBody:{
        id:"ID"    
    },
    media: {mimeType:"message/rfc822",body:attachment},
  })
//---------------lists out the drafted mails -------------//
  // const listRes = await gmail.users.drafts.list({
  //   userId:"me"
  // })

//-----------------send a drafted mail with its uniquely created id by gmail.------------//
  // const sendRes = await gmail.users.drafts.send({
  //   userId: 'me',
  //   requestBody: {
  //     id: draftRes.data.id,
  //   }
  // });
  const labels = draftRes.data;
  console.log(labels)
  await fs.unlink("./email.eml",()=>{console.log("deleted email.eml")}) 
}

async function sendMail(auth,recipientArr,subject,message,fileName,path){
  for(let i=0;i<recipientArr.length;i++){
    await sendMailSingle(auth,recipientArr[i],subject,message,fileName,path)
  }
}


module.exports = { sendMail,authorize }