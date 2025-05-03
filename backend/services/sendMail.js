// This is a placeholder for an email sending utility
// You'll need to install a package like nodemailer to implement this fully

const nodemailer = require('nodemailer');

/**
 * Send email utility function
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text content (optional)
 * @param {String} options.html - HTML content (optional)
 */
const sendEmail = async (options) => {
  // Create a transporter
  // For production, you would use your actual SMTP settings
  // For development, you can use a testing service like Mailtrap or Ethereal
  
  // Example with Ethereal (for testing)
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  
  // Log URL for testing (when using Ethereal)
  if (testAccount) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

module.exports = sendEmail;