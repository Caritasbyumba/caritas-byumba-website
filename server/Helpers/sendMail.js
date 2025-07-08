import 'dotenv/config';
import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, body) => {
  let user = process.env.EMAIL;
  let pass = process.env.PASSWORD;
  let transporter = nodemailer.createTransport({
    name: 'www:caritasbyumba.org',
    host: process.env.MAIL_HOST,
    port: 587,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: user,
      pass: pass,
    },
    tls: { rejectUnauthorized: false },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: user, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });

  console.log('Message sent: %s', info.messageId);
};
