const express = require('express');
const router = express.Router();
const { register, login,getProfile,updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile',getProfile)
router.put('/:id',updateProfile)

module.exports = router;
