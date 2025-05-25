
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // ✅ Load .env first

const connectDB = require("./mongodb/ConnectDB"); // MongoDB connection
const createDefaultAdmin = require("./config/createDefaultAdmin"); // Default admin

// Routers
const adminRouter = require("./routes/admin/admin.route");
const staffRouter = require("./routes/staff/staffmenu.route");
const orderRouter = require("./routes/User/Orderpay.route");
const { userRouter } = require("./routes/User/user.route");
const favoritesRouter = require("./routes/User/favorite.route");
const profileRouter = require("./routes/User/profile.route");
const { khaltiRouter } = require("./routes/User/khalti.route");
const promocodeRoute = require("./routes/admin/promocode.route");
const categoryroute = require("./routes/staff/category.route");
const userRouteDetails = require("./routes/admin/user.route");
const registerRoute = require("./routes/User/register.route");
const rewardPoints = require("./routes/staff/rewardmenu.route");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://cafeteria-ecru.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));

// ✅ Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API routes
app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/favorite", favoritesRouter);
app.use("/api/profile", profileRouter);
app.use("/api/adminpromo", promocodeRoute);
app.use("/api/category", categoryroute);
app.use("/api/users", userRouteDetails);
app.use("/api/auth", registerRoute);
app.use("/api", khaltiRouter);
app.use("/api/reward-point", rewardPoints)

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running okay!" });
});

// ✅ Initialize the application
const initializeApp = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await connectDB();
    console.log("MongoDB connected");

    await createDefaultAdmin();
    console.log("Default admin ensured");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to initialize the application:", error.message);
    process.exit(1);
  }
};

initializeApp();
