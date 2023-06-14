const MailComposer = require('nodemailer/lib/mail-composer');
const fs = require("fs")
async function createEmlWithAttachment(recipient,subject,emailMessage,pathArr) {
  // Compose the email message
  let attachmentObj = []
  for(let i=0;i<pathArr.length;i++){
    const fileName = pathArr[i].split('\\').pop();
    const pathVar = pathArr[i]
    attachmentObj.push({filename:fileName,path:pathVar})
  }
  const message = {
    from: 'dev@gmail.com',
    to: recipient,
    subject: subject,
    text: emailMessage,
    attachments:attachmentObj
  };

  // Create a new MailComposer instance
  const mailComposer = new MailComposer(message);

  // Generate the raw email content
  const generatedEmail = await mailComposer.compile().build();
  // Save the email as an .eml file
  fs.writeFileSync('email.eml', generatedEmail);
  const attachment = fs.createReadStream('./email.eml')
  console.log('EML file created: email.eml');
  return attachment
}
// createEmlWithAttachment("verma.arpit078@gmail.com","Hi","Hello",["path:D:\\PET-PROJECTS\\colMail\\app\\preload.js","path:D:\\PET-PROJECTS\\colMail\\app\\test.XLSX"])
module.exports = {createEmlWithAttachment}
