const express = require('express');
const router = express.Router();
const { register, login,getProfile,updateProfile } = require('../controllers/authController');
const protect=require('../middlewares/authMiddleware')

router.post('/register', register);
router.post('/login', login);
router.get('/profile',protect,getProfile)
router.put('/:id',protect,updateProfile)

module.exports = router;
