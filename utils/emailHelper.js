const nodemailer = require("nodemailer");
require("dotenv").config();
const mailHelper = async function(){
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP__PASS,
        },
      });
    //   const mailId = process.env.EMAIL_ID
    const message = {
        // from: `"Akhil Agrawal" ${mailId}`, // sender address
        from: '"Akhil Agrawal" akhil.agrawal.india@gmail.com', // sender address
        to: option.email,
        subject: option.subject, 
        text: option.message,
        // html: "<a></a>   ", 
        }
    await transporter.sendMail(message);
}

module.exports = mailHelper