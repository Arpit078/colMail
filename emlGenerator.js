const MailComposer = require('nodemailer/lib/mail-composer');
const fs = require("fs")
async function createEmlWithAttachment(recipient,subject,emailMessage,filename,path) {
  // Compose the email message
  const message = {
    from: 'dev@gmail.com',
    to: recipient,
    subject: subject,
    text: emailMessage,
    attachments: [
      {
        filename: filename,
        path: path, // Replace with the actual path to the PDF file
      },
    ],
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

module.exports = {createEmlWithAttachment}
