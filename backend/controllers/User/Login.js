

const bcrypt = require('bcrypt');  // Make sure this matches what's used in the User model
const jwt = require("jsonwebtoken");
const User = require("../../models/user/User");

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if(user.isVerified==false && user.role==="user"){
      return res.status(404).json({ success: false, message: 'User not verified' });
  }

    // Directly compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "iamrohanmagar", {
      expiresIn: "1d", // Token expiration time
    });

    // Create a user object with all fields except password and sensitive tokens
    const userResponse = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      contact: user.contact,
      role: user.role,
      profileImage: user.profileImage,
      staffType: user.staffType,
      address: user.address,
      isVerified: user.isVerified,
      rewardPoints: user.rewardPoints,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send token as response
      user: userResponse // Send all user information
    });
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = loginUser;