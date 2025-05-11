// const User = require('../../models/user/User');
// const crypto = require('crypto');
// const sendEmail = require('../../services/sendMail');

// const registerUser = async (req, res) => {
//   const { fullname, email, contact, password, role, staffType } = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({success: false, message: "User already exists" });

//     // Generate verification token
//     const verificationToken = crypto.randomBytes(32).toString('hex');

//     // Create user with plain password (will be hashed by pre-save hook)
//     const userData = {
//       fullname,
//       email,
//       contact,
//       password, // No need to hash here - pre-save hook will do it
//       role,
//       verificationToken
//     };
    
//     // Add staffType if role is staff
//     if (role === 'staff' && staffType) {
//       userData.staffType = staffType;
//     }

//     const user = await User.create(userData);

//     // Email verification code (commented out as in your original)
//     // const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
//     // const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;
//     // await sendEmail({ to: email, subject: "Email Verification", html });

//     res.status(201).json({success: true, message: "Registration successful, check your email to verify." });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ success: false, message: "Registration failed", error: error.message });
//   }
// };

// const verifyEmail = async (req, res) => {
//   const { token } = req.params;

//   try {
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.status(200).json({ success: true, message: "Email verified successfully!" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Verification failed", error: error.message });
//   }
// };

// const resendVerificationEmail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     user.verificationToken = verificationToken;
//     await user.save();

//     const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
//     const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

//     await sendEmail({ to: email, subject: "Resend Email Verification", html });

//     res.status(200).json({ success: true, message: "Verification email resent" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to resend email", error: error.message });
//   }
// };

// module.exports = { registerUser, verifyEmail, resendVerificationEmail };



// const User = require('../../models/user/User');
// const crypto = require('crypto');
// const sendEmail = require('../../services/sendMail');
// const jwt = require('jsonwebtoken')

// const registerUser = async (req, res) => {
//   const { fullname, email, contact, password, role, staffType } = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

//     // Generate verification token
//     const verificationToken = crypto.randomBytes(32).toString('hex');

//     // Create user with plain password (will be hashed by pre-save hook)
//     const userData = {
//       fullname,
//       email,
//       contact,
//       password, // Will be hashed by the pre-save hook
//       role: role || "user",
//       verificationToken
//     };
    
//     // Add staffType if role is staff
//     if (role === 'staff' && staffType) {
//       userData.staffType = staffType;
//     }

//     const user = await User.create(userData);

//     // Email verification (uncomment when ready to implement)
//     // const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
//     // const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;
//     // await sendEmail({ to: email, subject: "Email Verification", html });


//     const verifyToken = jwt.sign(
//       { id: userData._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//   );  

//   sendEmail.verifyEmailMail(
//     userData.email,
//       verifyToken
//   )

//   if (!userData) {
//       return res.status(500).json({ success: false, message: "Unable to create user" });
//   }
//   res.status(201).json({
//     success: true,
//     message: "User created successfully",
//     data: { id: userData._id, name: userData.fullname, email: userData.email },
// });
//     // res.status(201).json({ success: true, message: "Registration successful, check your email to verify." });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ success: false, message: "Registration failed", error: error.message });
//   }
// };

// // const verifyEmail = async (req, res) => {
// //   const { token } = req.params;

// //   try {
// //     const user = await User.findOne({ verificationToken: token });
// //     if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

// //     user.isVerified = true;
// //     user.verificationToken = undefined;
// //     await user.save();

// //     res.status(200).json({ success: true, message: "Email verified successfully!" });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Verification failed", error: error.message });
// //   }
// // };

// const resendVerificationEmail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     user.verificationToken = verificationToken;
//     await user.save();

//     const verificationUrl = `${process.env.BASE_URL}/verify/${verificationToken}`;
//     const html = `<h3>Verify Your Email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

//     await sendEmail({ to: email, subject: "Resend Email Verification", html });

//     res.status(200).json({ success: true, message: "Verification email resent" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to resend email", error: error.message });
//   }
// };

// const verifyEmail = async (req, res) => {
//   try {
//       const { token } = req.params;
//       if (!token) {
//           return res.status(400).json({ success: false, message: "Token is required" });
//       }

//       let decoded;
//       try {
//           decoded = jwt.verify(token, process.env.JWT_SECRET);
//       } catch (err) {
//           return res.status(400).json({ success: false, message: "Invalid or expired token" });
//       }

//       const user = await User.findById(decoded.id);
//       if (!user) {
//           return res.status(404).json({ success: false, message: "User not found" });
//       }

//       user.verify = true;
//       await user.save();

//       return res.status(200).json({ success: true, message: "Email verified successfully" });


//   } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = { registerUser, verifyEmail, resendVerificationEmail };




// const User = require('../../models/user/User');
// const crypto = require('crypto');
// const { verifyEmailMail } = require('../../services/sendMail');
// const jwt = require('jsonwebtoken');

// const registerUser = async (req, res) => {
//   const { fullname, email, contact, password, role, staffType } = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

//     // Create user with plain password (will be hashed by pre-save hook)
//     const userData = {
//       fullname,
//       email,
//       contact,
//       password, // Will be hashed by the pre-save hook
//       role: role || "user",
//     };
    
//     // Add staffType if role is staff
//     if (role === 'staff' && staffType) {
//       userData.staffType = staffType;
//     }

//     // Create the user first
//     const user = await User.create(userData);

//     // Then generate the token with the correct ID
//     const verifyToken = jwt.sign(
//       { id: user._id }, // Use user._id instead of userData._id
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );  

//     // Send verification email
//     try {
//       await verifyEmailMail(user.email, verifyToken);
//       console.log("Verification email sent successfully");
//     } catch (emailErr) {
//       console.error("Error sending verification email:", emailErr);
//       // Continue with registration even if email fails
//     }

//     res.status(201).json({
//       success: true,
//       message: "User created successfully. Please check your email to verify your account.",
//       data: { id: user._id, name: user.fullname, email: user.email },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ success: false, message: "Registration failed", error: error.message });
//   }
// };

// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;
//     if (!token) {
//       return res.status(400).json({ success: false, message: "Token is required" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ success: false, message: "Invalid or expired token" });
//     }

//     // Log the decoded token to debug
//     console.log("Decoded token:", decoded);

//     const user = await User.findById(decoded.id);
//     if (!user) {
//       console.log("User not found for ID:", decoded.id);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Update the correct field name (isVerified instead of verify)
//     user.isVerified = true;
//     await user.save();

//     return res.status(200).json({ success: true, message: "Email verified successfully" });
//   } catch (error) {
//     console.error("Verification error:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const resendVerificationEmail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

//     // Generate new token
//     const verifyToken = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Send verification email
//     try {
//       await verifyEmailMail(user.email, verifyToken);
//       res.status(200).json({ success: true, message: "Verification email resent" });
//     } catch (emailErr) {
//       console.error("Error sending verification email:", emailErr);
//       res.status(500).json({ success: false, message: "Failed to send email" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to resend email", error: error.message });
//   }
// };

// module.exports = { registerUser, verifyEmail, resendVerificationEmail };


const User = require('../../models/user/User');
const jwt = require('jsonwebtoken');
const { verifyEmailMail } = require('../../services/sendMail');

const registerUser = async (req, res) => {
  const { fullname, email, contact, password, role, staffType } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    // Create user data
    const userData = {
      fullname,
      email,
      contact,
      password,
      role: role || "user",
    };
    
    // Add staffType if role is staff
    if (role === 'staff' && staffType) {
      userData.staffType = staffType;
    }

    // Create the user
    const user = await User.create(userData);

    // Generate token with string ID
    const verifyToken = jwt.sign(
      { id: user._id.toString() }, // Convert ObjectId to string
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send verification email
    try {
      await verifyEmailMail(user.email, verifyToken);
      console.log("Verification email sent to:", user.email);
    } catch (emailErr) {
      console.error("Error sending verification email:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email to verify your account.",
      data: { id: user._id, name: user.fullname, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Try multiple approaches to find the user
    let user;

    // First try findById with string ID
    user = await User.findById(decoded.id);
    
    // If that fails, try findOne with _id
    if (!user) {
      user = await User.findOne({ _id: decoded.id });
    }

    // If user still not found
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();
    console.log("User verified successfully:", user.email);

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

    // Generate new token
    const verifyToken = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send verification email
    try {
      await verifyEmailMail(user.email, verifyToken);
      res.status(200).json({ success: true, message: "Verification email resent" });
    } catch (emailErr) {
      console.error("Error sending verification email:", emailErr);
      res.status(500).json({ success: false, message: "Failed to send email" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to resend email", error: error.message });
  }
};

module.exports = { registerUser, verifyEmail, resendVerificationEmail };