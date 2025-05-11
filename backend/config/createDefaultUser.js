// const User = require("../models/user/User");
// require("dotenv").config();

// /**
//  * Create a default user account if it doesn't exist
//  */
// const createDefaultUser = async () => {
//   try {
//     // Check if default user already exists
//     const defaultUserEmail = process.env.DEFAULT_USER_EMAIL || "rohan@gmail.com";
//     const existingUser = await User.findOne({ email: defaultUserEmail });
    
//     if (existingUser) {
//       console.log("Default user account already exists");
//       return;
//     }
    
//     // Create default user
//     const defaultUser = new User({
//       fullname: process.env.DEFAULT_USER_NAME || "Default User",
//       email: defaultUserEmail,
//       password: process.env.DEFAULT_USER_PASSWORD || "secret123",
//       contact: process.env.DEFAULT_USER_CONTACT || "9876543210",
//       role: "user",
//       isVerified: true,
//       address: {
//         street: process.env.DEFAULT_USER_STREET || "123 Main St",
//         city: process.env.DEFAULT_USER_CITY || "Anytown",
//         state: process.env.DEFAULT_USER_STATE || "State",
//         postalCode: process.env.DEFAULT_USER_POSTAL_CODE || "12345",
//         country: process.env.DEFAULT_USER_COUNTRY || "Country"
//       }
//     });
    
//     await defaultUser.save();
//     console.log("Default user account created successfully");
//   } catch (error) {
//     console.error("Error creating default user account:", error);
//   }
// };

// module.exports = createDefaultUser;