const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/student/User')

// Register Controller
 const registerUser = async (req, res) => {
  const { fullName, email, contact, password } = req.body;



  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname:fullName,
      email,
      contact,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

 

    res.status(201).json({
      success:true,
      message: "User registered successfully",
      User
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Server error" });
  }
};


module.exports = registerUser