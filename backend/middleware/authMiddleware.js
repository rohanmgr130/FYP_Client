const jwt = require("jsonwebtoken");
const User = require("../models/user/User");

// Middleware to verify user token
exports.authenticateUser = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;


    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication failed: No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];


    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    
    // Find the user by ID
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Add user info to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error during authentication" 
    });
  }
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin rights required"
      });
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};