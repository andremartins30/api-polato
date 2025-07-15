const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateUpdateProfile, validateChangePassword } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User profile routes
router.put('/profile', validateUpdateProfile, userController.updateProfile);
router.put('/password', validateChangePassword, userController.changePassword);
router.delete('/deactivate', userController.deactivateAccount);

// Admin only routes
router.get('/', requireRole('admin'), userController.getAllUsers);
router.get('/:id', requireRole('admin'), userController.getUserById);
router.delete('/:id', requireRole('admin'), userController.deleteUser);

module.exports = router;
