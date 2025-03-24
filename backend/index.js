const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./mongodb/ConnectDB"); // MongoDB connection
const adminRouter = require("./routes/admin/admin.route"); // Admin routes (if applicable)
const staffRouter = require("./routes/staff/staffmenu.route"); // Staff menu routes

const app = express();
const PORT = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Frontend origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

// Define API routes
app.use("/api/admin", adminRouter); // Admin-related routes (if any)
app.use("/api/staff", staffRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running okay!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
