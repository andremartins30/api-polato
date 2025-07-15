const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/refresh', authenticateToken, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
