const bcrypt = require('bcryptjs'); // Import bcrypt
const Staff = require("../../models/admin/addStaff");

// Adding new staff
const addStaff = async (req, res) => {
    try {
        const { name, role, email, phone, password } = req.body;

        // Check if all required fields are provided
        if (!name || !role || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Check if staff with the same email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ success: false, message: "Staff with this email already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new staff entry in the database
        const staff = await Staff.create({
            name,
            role,
            email,
            phone,
            password: hashedPassword, // Save the hashed password
        });

        // If staff creation fails
        if (!staff) {
            return res.status(400).json({ success: false, message: "Unable to create staff" });
        }

        // Return success message and created staff details
        return res.status(201).json({ success: true, message: "Staff created successfully", staff });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all staffs
const getAllStaffs = async (req, res) => {
    try {
        // Fetch all staff members from the database
        const staffs = await Staff.find({});
        if (!staffs || staffs.length === 0) {
            return res.status(400).json({ success: false, message: "Staff not found" });
        }
        return res.status(200).json({ success: true, message: "Staff found successfully", staffs });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update staff
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're passing staff ID in URL
        const { name, role, email, phone, password } = req.body;

        // Check if all required fields are provided
        if (!name || !role || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        // Encrypt password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password

        // Update staff record in the database
        const staff = await Staff.findByIdAndUpdate(id, { name, role, email, phone, password: hashedPassword }, { new: true });

        // If staff update fails
        if (!staff) {
            return res.status(400).json({ success: false, message: "Unable to update staff" });
        }

        // Return success message and updated staff details
        return res.status(200).json({ success: true, message: "Staff updated successfully", staff });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete staff
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params; // Getting staff ID from URL parameter

        // Find and delete the staff member by ID
        const staff = await Staff.findByIdAndDelete(id);

        // If staff not found
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        // Return success message
        return res.status(200).json({ success: true, message: "Staff deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    addStaff,
    getAllStaffs,
    updateStaff,
    deleteStaff,
};
