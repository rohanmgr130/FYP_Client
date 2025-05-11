const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Staff = require('../../models/stafflog/staff');

// Register Controller
const registerstaff = async (req, res) => {
  const { fullName, email, contact, password } = req.body;

  try {
    // Check if staff already exists
    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ success: false, message: "Staff already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new staff
    const newStaff = new Staff({
      fullname: fullName,
      email,
      contact,
      password: hashedPassword,
    });

    // Save staff to database
    const savedStaff = await newStaff.save();

    res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      staff: {
        id: savedStaff._id,
        fullname: savedStaff.fullname,
        email: savedStaff.email,
        contact: savedStaff.contact,
        createdAt: savedStaff.createdAt,
        updatedAt: savedStaff.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: "Server error" });
  }
};

module.exports = registerstaff