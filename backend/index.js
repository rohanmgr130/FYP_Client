const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./mongodb/ConnectDB"); // MongoDB connection
const adminRouter = require("./routes/admin/admin.route"); // Admin routes (if applicable)
const staffRouter = require("./routes/staff/staffmenu.route"); // Staff menu routes
const orderRouter = require("./routes/User/Orderpay.route")
const { userRouter } = require("./routes/User/user.route");
const favoritesRouter = require("./routes/User/favorite.route");
const profileRouter = require("./routes/User/profile.route");
// const OrderHistoryRouter = require("./routes/User/orderhistory.route");




const path = require('path');
const { khaltiRouter } = require("./routes/User/khalti.route");
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
app.use("/api/order", orderRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/profile", profileRouter);
// app.use("/api/orderhistory", OrderHistoryRouter);
app.use(khaltiRouter)

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running okay!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

