const {authorize} = require('./auth.js')
const {google} = require('googleapis');
const fs = require('fs').promises;


async function reminderMediary(data,arr) {
  const reminderfilePath = "./script/gmail/data/remind.json"
  const auth = await authorize()
  const gmail = google.gmail({ version: 'v1', auth });
  const thread = await gmail.users.threads.get({
    format: 'MINIMAL',
    id: data.data.threadId,
    userId: 'me',
  });
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${day}-${month}-${year}`;//29-05-2023
  if(thread.data.messages.length==1 && data.date != formattedDate){
    arr.push(data)
  }
}

// reminder('1886cdc53f6a67ee').then(res=>console.log(res))

async function reminder(){
  const sentfilePath = "./script/gmail/data/sent.json"
  const reminderfilePath = "./script/gmail/data/remind.json"
  const data = await fs.readFile(sentfilePath, 'utf8',()=>console.error());
  let jsonData = JSON.parse(data);
  let arr=[]
  for(let i=0;i<jsonData.length;i++){
    await reminderMediary(jsonData[i],arr)
  }
  await fs.writeFile(reminderfilePath, JSON.stringify(arr, null, 2), 'utf8');
  return arr.length
}

module.exports = {reminder}
