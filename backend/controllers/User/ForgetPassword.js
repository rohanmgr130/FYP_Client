const User = require('../../models/user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendForgotPasswordMail } = require('../../services/sendMail');


// Request password reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No user found with this email address" 
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET || "iamrohanmagar",
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Save reset token and expiry to user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    // Send reset email
    try {
      await sendForgotPasswordMail(user.email, resetToken);
      console.log("Password reset email sent to:", user.email);
      
      return res.status(200).json({
        success: true,
        message: "Password reset email sent. Please check your inbox."
      });
    } catch (emailErr) {
      console.error("Error sending reset email:", emailErr);
      
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      res.status(500).json({ 
        success: false, 
        message: "Failed to send reset email. Please try again." 
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Reset token is required" 
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Password and confirm password are required" 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "iamrohanmagar");
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Update password (will be hashed by the pre-save middleware)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password reset successful for user:", user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later." 
    });
  }
};

// Verify reset token (optional - to check if token is valid before showing reset form)
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Reset token is required" 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "iamrohanmagar");
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    // Check if user exists and token is valid
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset token is valid",
      email: user.email // Optionally return email to show in UI
    });

  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

module.exports = { 
  forgotPassword, 
  resetPassword, 
  verifyResetToken 
};