const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./mongodb/ConnectDB"); // MongoDB connection
const adminRouter = require("./routes/admin/admin.route"); // Admin routes (if applicable)
const staffRouter = require("./routes/staff/staffmenu.route"); // Staff menu routes
const addToCartRouter = require("./routes/user/addtocarts.route");
const { userRouter } = require("./routes/User/user.route");
// const regRouter = require("./routes/User/user.route");


const app = express();
const PORT = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Define API routes
app.use("/api/admin", adminRouter); // Admin-related routes (if any)
app.use("/api/staff", staffRouter);
app.use("/api/cart", addToCartRouter);
app.use("/api", userRouter);


app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running okay!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
