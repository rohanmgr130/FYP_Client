
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/student/User');
const Staff = require('../../models/stafflog/staff');

// Register Controller
 const registerstaff = async (req, res) => {
  const { fullName, email, contact, password } = req.body;



  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "staff already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Staff({
      fullname:fullName,
      email,
      contact,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

 

    res.status(201).json({
      success:true,
      message: "staff registered successfully",
      User
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Server error" });
  }
};


module.exports = registerstaff