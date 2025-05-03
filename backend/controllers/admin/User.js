const User = require('../../models/user/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password -verificationToken -resetPasswordToken');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all staff (users with role 'staff')
const getAllStaff = async (req, res) => {
    console.log('staff');

  try {
        console.log('staff');

    
    const staff = await User.find({ role: 'staff' }).select('-password -verificationToken -resetPasswordToken');
    console.log('staff', staff);

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff data',
      error: error.message
    });
  }
};

// Get staff by type
const getStaffByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate staff type
    const validStaffTypes = ["chef", "waiter", "cashier", "manager", "cleaner", "bartender", "host", "kitchen_helper", "delivery"];
    if (!validStaffTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid staff type: ${type}`,
        validTypes: validStaffTypes
      });
    }
    
    const staff = await User.find({ 
      role: 'staff', 
      staffType: type 
    }).select('-password -verificationToken -resetPasswordToken');
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff by type',
      error: error.message
    });
  }
};

// Get all admin users
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password -verificationToken -resetPasswordToken');
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin data',
      error: error.message
    });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Create a new user
const createUser = async (req, res) => {
    console.log('Request body:');

    try {
      console.log('Request body:', req.body);
      
      // Validate staff type if role is staff
      if (req.body.role === 'staff' && !req.body.staffType) {
        return res.status(400).json({
          success: false,
          message: 'Staff type is required for staff users',
          validStaffTypes: ["chef", "waiter", "cashier", "manager", "cleaner", "bartender", "host", "kitchen_helper", "delivery"]
        });
      }
      
      // If role is not staff, make sure staffType is not set
      if (req.body.role !== 'staff') {
        // Remove staffType if it was provided but role is not staff
        delete req.body.staffType;
      }
      
      console.log('Processed request body:', req.body);
      
      // Create the user with the processed request body
      const user = await User.create(req.body);
      
      // Remove sensitive data before sending response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.verificationToken;
      delete userResponse.resetPasswordToken;
      
      // Log after userResponse is created
      console.log('User created successfully:', userResponse);
      
      res.status(201).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Better error handling with more details
      let errorMessage = 'Failed to create user';
      let errorDetails = {};
      
      if (error.name === 'ValidationError') {
        // Handle mongoose validation errors
        errorMessage = 'Validation failed';
        errorDetails = Object.keys(error.errors).reduce((acc, field) => {
          acc[field] = error.errors[field].message;
          return acc;
        }, {});
      } else if (error.code === 11000) {
        // Handle duplicate key errors (usually email)
        errorMessage = 'Email already in use';
      }
      
      res.status(400).json({
        success: false,
        message: errorMessage,
        error: error.message,
        details: errorDetails
      });
    }
  };

// Update user
const updateUser = async (req, res) => {
  try {
    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }
    
    const { role, staffType } = req.body;
    const userId = req.params.id;
    
    // Handle staff role and type validation
    if (role === 'staff') {
      // If updating to staff role, check if staffType is provided
      if (!staffType && !(await User.findOne({ _id: userId, role: 'staff' }))) {
        return res.status(400).json({
          success: false,
          message: 'Staff type is required when changing role to staff',
          validStaffTypes: ["chef", "waiter", "cashier", "manager", "cleaner", "bartender", "host", "kitchen_helper", "delivery"]
        });
      }
    } else if (role && role !== 'staff') {
      // If changing from staff to another role, remove staffType
      req.body.staffType = undefined;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    ).select('-password -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Export all controller functions
module.exports = {
  getAllUsers,
  getAllStaff,
  getStaffByType,
  getAllAdmins,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};