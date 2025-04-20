const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Staff = require("../../models/staff/staff.js");

// Login Controller
const loginstaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Staff.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "iamrohanmagar", {
      expiresIn: "1h", // Token expiration time
    });

    // Return user information along with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      email: user.email,
      fullname: user.fullName || user.name || "User", // Adjust based on your schema
      id: user._id.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = loginstaff;