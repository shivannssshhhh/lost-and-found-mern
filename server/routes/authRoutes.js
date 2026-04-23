const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/register
router.post('/register', registerUser);

// @route   POST /api/login
router.post('/login', loginUser);

// @route   GET /api/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
