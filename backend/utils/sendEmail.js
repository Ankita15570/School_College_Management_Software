const transporter = require('../config/email');

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};