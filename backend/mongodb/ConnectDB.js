// const mongoose = require("mongoose");

// // MongoDB connection URI (use environment variable for security)
// const mongoURI = process.env.MONGO_URI ;

// // Function to connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     process.exit(1); // Exit the process with failure
//   }
// };

// module.exports = connectDB;



const mongoose = require("mongoose");

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
