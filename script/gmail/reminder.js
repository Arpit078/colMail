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
  console.log(thread.data.messages)
  if(thread.data.messages.length==1){
    arr.push(data)
    console.log("written")
  }
}

// reminder('1886cdc53f6a67ee').then(res=>console.log(res))

async function reminder(){
  const sentfilePath = "./script/gmail/data/sent.json"
  const reminderfilePath = "./script/gmail/data/remind.json"
  const data = await fs.readFile(sentfilePath, 'utf8',()=>console.error());
  let jsonData = JSON.parse(data);
  console.log(jsonData)
  let arr=[]
  for(let i=0;i<jsonData.length;i++){
    await reminderMediary(jsonData[i],arr)
  }
  await fs.writeFile(reminderfilePath, JSON.stringify(arr, null, 2), 'utf8');
}

module.exports = {reminder}
