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
  const verifyLink = `${process.env.FRONTEND_URL}/verifyemail?t=${token}`;
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
                             <a href="${verifyLink}" style="background-color: #4A5568; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; padding: 16px 30px; border-radius: 8px; transition: all 0.3s; box-shadow: 0 4px 10px rgba(74, 85, 104, 0.2);">Verify Email</a>
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



//forgot password
const sendForgotPasswordMail = async (email, token) => {
  const resetLink = `${process.env.NEXT_BASE_URL}/reset-password?t=${token}`;
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
            <title>Password Reset - CafeteriaEase</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; background-color: #f9f9f9;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding: 20px 0;">
                  <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 20px; background-color: #2C5282; text-align: center; color: #fff; font-size: 22px;">
                        CafeteriaEase - Ordering System
                      </td>
                    </tr>
  
                    <!-- Main content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px; color: #2C5282; font-size: 24px;">Reset Your Password</h2>
                        
                        <p style="margin: 0 0 20px; font-size: 16px;">Hello 👋,</p>
                        
                        <p style="margin: 0 0 20px; font-size: 16px;">
                          We received a request to reset your password for your <strong>CafeteriaEase</strong> account. If you made this request, please click the button below to set a new password:
                        </p>
                        
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="background-color: #2C5282; border-radius: 6px; text-align: center; padding: 15px;">
                              <a href="${resetLink}"style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
  
                        <p style="margin: 30px 0 0; font-size: 14px; color: #555;">If you didn’t request a password reset, you can safely ignore this email.</p>
                        <p style="margin: 10px 0 0; font-size: 14px; color: #555;">This reset link will expire after a limited time.</p>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CafeteriaEase. All rights reserved.</p>
                        <p style="margin: 5px 0 0;">Ordering system , Nepal</p>
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
      console.log("Error while sending password reset mail:", error);
    }
  };
  

module.exports = { verifyEmailMail, sendForgotPasswordMail };

