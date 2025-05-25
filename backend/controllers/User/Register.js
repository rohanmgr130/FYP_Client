
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

    let verifyToken

    if(user.role === 'user'){
      // Generate token with string ID
      verifyToken = jwt.sign(
        { id: user._id.toString() }, // Convert ObjectId to string
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
       await verifyEmailMail(user.email, verifyToken);
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