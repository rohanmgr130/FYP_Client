const nodemailer = require('nodemailer');

// Configure transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "rohanmgr130@gmail.com",
    pass: "kjud zgbl ubce xsoe"
  }
});

// Email verification function
const verifyEmailMail = async (email, token) => {
   try {
     const mailOptions = {
       from: `CafeteriaEase <rohanmgr130@gmail.com>`,
       to: email,
       subject: 'Verify Your Email - CafeteriaEase',
       html: `
         <!DOCTYPE html>
         <html>
         <head>
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Email Verification - CafeteriaEase</title>
           <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
         </head>
         <body style="margin: 0; padding: 0; font-family: 'Inter', 'Segoe UI', sans-serif; color: #333333; background-color: #f0f2f5;">
           <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
             <tr>
               <td style="padding: 30px 0;">
                 <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; margin: 0 auto;">
                   
                   <!-- Header with logo -->
                   <tr>
                     <td style="background-color: #4A5568; text-align: center; padding: 25px 30px;">
                       <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">CafeteriaEase</h1>
                     </td>
                   </tr>
   
                   <!-- Main content -->
                   <tr>
                     <td style="padding: 40px 30px; background-color: #ffffff;">
                       <h2 style="margin: 0 0 25px; color: #4A5568; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h2>
                       
                       <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4A5568;">Hello there 👋,</p>
                       
                       <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.6; color: #4A5568;">Thanks for signing up at <strong>CafeteriaEase</strong> – your one-stop solution for browsing menus, placing food orders, and managing your cafeteria experience! To get started, please verify your email address by clicking the button below:</p>
                       
                       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 35px 0;">
                         <tr>
                           <td align="center">
                             <a href="http://localhost:3000/verifyemail?t=${token}" style="background-color: #4A5568; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; padding: 16px 30px; border-radius: 8px; transition: all 0.3s; box-shadow: 0 4px 10px rgba(74, 85, 104, 0.2);">Verify Email</a>
                           </td>
                         </tr>
                       </table>
   
                       <div style="margin: 35px 0 0; padding: 20px; background-color: #F7FAFC; border-radius: 8px; border-left: 4px solid #4A5568;">
                         <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5; color: #4A5568;">If you didn't sign up, you can safely ignore this email.</p>
                         <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4A5568;">This verification link will expire after a limited time.</p>
                       </div>
                     </td>
                   </tr>
   
                   <!-- Footer -->
                   <tr>
                     <td style="background-color: #EDF2F7; text-align: center; padding: 25px 30px; border-top: 1px solid #E2E8F0;">
                       <p style="margin: 0 0 5px; font-size: 14px; color: #718096;">&copy; ${new Date().getFullYear()} CafeteriaEase. All rights reserved.</p>
                       <p style="margin: 0; font-size: 13px; color: #718096;">Kathmandu, Nepal</p>
                     </td>
                   </tr>
   
                 </table>
               </td>
             </tr>
           </table>
         </body>
         </html>
       `,
     };
   
     return new Promise((resolve, reject) => {
       transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
           reject(error);
         } else {
           resolve(info);
         }
       });
     });
   } catch (error) {
    console.log("Error while sending verification mail : ", error);
   }
};

module.exports = { verifyEmailMail };