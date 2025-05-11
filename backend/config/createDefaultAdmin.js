
const User = require("../models/user/User");
require("dotenv").config();

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    
    if (!adminExists) {
      console.log("No admin account found. Creating default admin account...");
      
      // Create default admin
      const defaultAdmin = new User({
        fullname: process.env.DEFAULT_ADMIN_NAME || "System Administrator",
        email: process.env.DEFAULT_ADMIN_EMAIL || "admin@cafeteria.com",
        password: process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123",
        contact: process.env.DEFAULT_ADMIN_CONTACT || "0000000000",
        role: "admin",
        isVerified: true,
        address: {  
          street: process.env.DEFAULT_ADMIN_STREET || "Admin Street",
          city: process.env.DEFAULT_ADMIN_CITY || "Admin City",
          state: process.env.DEFAULT_ADMIN_STATE || "Admin State",
          postalCode: process.env.DEFAULT_ADMIN_POSTAL_CODE || "00000",
          country: process.env.DEFAULT_ADMIN_COUNTRY || "Admin Country"
        }
      });
      
      await defaultAdmin.save();
      console.log("Default admin account created successfully!");
      console.log(`Email: ${defaultAdmin.email}`);
      console.log("Password: [Hidden for security]");
      console.log("Please change these credentials after first login.");
    } else {
      console.log("Admin account already exists. Skipping default admin creation.");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

module.exports = createDefaultAdmin;