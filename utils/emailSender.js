const config = require('../config/config.json')
const nodemailer = require('nodemailer');// const smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async (user) => {
  console.log('### sendEmail', config.email.user, config.email.pass, user.EMAIL)
  // nodemailer Transport 생성
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    }
  });

  const emailOptions = { // 옵션값 설정    
    from: config.email.user,
    to: 'chmin82@gmail.com',
    subject: 'Sending Email using Node.js[nodemailer]',
    text: `That was easy! for ${user.EMAIL}`
  };

  const result = await transporter.sendMail(emailOptions);

  console.log('Message sent: %s', result);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = {
  sendEmail,
}