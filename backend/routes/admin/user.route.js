const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../../middleware/authMiddleware');

const {
  getAllUsers,
  getAllStaff,
  getStaffByType,
  getAllAdmins,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../../controllers/admin/User');

// ===== User Routes =====

// Get all users
router.get('/', authenticateUser, getAllUsers);

// Get user by ID
router.get('/:id', authenticateUser, getUserById);

// Create staff (admin only)
router.post('/add-staff', authenticateUser, isAdmin, createUser);

// Update user
router.put('/:id', authenticateUser, isAdmin, updateUser);

// Delete user
router.delete('/:id', authenticateUser, isAdmin, deleteUser);

// ===== Staff Routes =====

// Get all staff
router.get('/staff/all', authenticateUser, isAdmin, getAllStaff);

// Get staff by specific type
router.get('/staff/:type', authenticateUser, isAdmin, getStaffByType);

// ===== Admin Routes =====

// Get all admins
router.get('/admins', authenticateUser, isAdmin, getAllAdmins);

module.exports = router;

