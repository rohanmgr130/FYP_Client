const User = require('../../models/user/User'); // Adjust path as needed

/**
 * Get user profile
 * @route GET /api/profile
 * @access Private
 */
const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware that adds user to request
    
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

module.exports = { getUser };