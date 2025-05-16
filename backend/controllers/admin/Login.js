const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../models/adminlog/admin");

// Login Controller
const loginadmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Staff.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success:false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "iamrohanmagar", {
      expiresIn: "1d", // Token expiration time
    });

    res.status(200).json({
      success:true,
      message: "Login successful",
      token, // Send token as response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:true, message: "Server error" });
  }
};


module.exports = loginadmin
