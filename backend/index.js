const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./mongodb/ConnectDB"); // MongoDB connection
const adminRouter = require("./routes/admin/admin.route"); // Admin routes (if applicable)
const staffRouter = require("./routes/staff/staffmenu.route"); // Staff menu routes

const { userRouter } = require("./routes/User/user.route");
// const Ordershistory = require("./models/user/Ordershistory");
// const regRouter = require("./routes/User/user.route");


const path = require('path');




const app = express();
const PORT = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define API routes
app.use("/api/admin", adminRouter); // Admin-related routes (if any)
app.use("/api/staff", staffRouter);

app.use("/api", userRouter);
// app.use("/api/orders",Ordershistory);


app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running okay!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
