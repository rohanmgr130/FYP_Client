// const User = require('../../models/user/User'); // Adjust path as needed

// /**
//  * Get user profile
//  * @route GET /api/profile
//  * @access Private
//  */
// const getUser = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you're using authentication middleware that adds user to request
//     // const userId = req.params.id

//     if (!userId) {
//       return res.status(404).json({ success: false, message: 'Userid is required' });
//     }
    
//     const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');
    
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching profile'
//     });
//   }
// };

// module.exports = { getUser };


const User = require('../../models/user/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profiles';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only image files'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * Get user profile
 * @route GET /api/profile/:id
 * @access Private
 */
const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(404).json({ success: false, message: 'User ID is required' });
    }
    
    const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

/**
 * Update user profile (name and profile image)
 * @route PUT /api/profile/update
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname } = req.body;

    // Validation
    if (!fullname || fullname.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 3 characters long'
      });
    }

    const updateData = {
      fullname: fullname.trim()
    };

    // If profile image is uploaded
    if (req.file) {
      const profileImagePath = `/uploads/profiles/${req.file.filename}`;
      updateData.profileImage = profileImagePath;

      // Delete old profile image if it exists
      const user = await User.findById(userId);
      if (user.profileImage && user.profileImage !== profileImagePath) {
        const oldImagePath = path.join(__dirname, '../..', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

/**
 * Change user password
 * @route PUT /api/profile/change-password
 * @access Private
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
};

/**
 * Delete profile image
 * @route DELETE /api/profile/delete-image
 * @access Private
 */
const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.profileImage) {
      return res.status(400).json({
        success: false,
        message: 'No profile image to delete'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../..', user.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove profile image from user record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profileImage: 1 } },
      { new: true }
    ).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires');

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting profile image'
    });
  }
};

module.exports = {
  getUser,
  updateProfile,
  changePassword,
  deleteProfileImage,
  upload
};