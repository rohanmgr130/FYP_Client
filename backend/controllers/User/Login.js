const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../../models/user/User")

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Compare password with hashed password
    const isMatch = bcrypt.compareSync(password, user.password)
 
    if (!isMatch) {
      return res.status(400).json({success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "iamrohanmagar", {
      expiresIn: "1h", // Token expiration time
    });

    // Create a user object with all fields except password and sensitive tokens
    const userResponse = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      contact: user.contact,
      role: user.role,
      address: user.address,
      isVerified: user.isVerified,
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
    console.log("login error", error)
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = loginUser