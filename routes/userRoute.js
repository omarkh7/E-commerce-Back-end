const express = require('express');
const { registerUser,
    loginUser,
    getMe
     } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/userAuthMiddleware');

const router = express.Router();


router.post('/register', registerUser)
router.route('/login').post(loginUser)
// router.route('/logout').post(logoutUser)
router.get('/me', isAuthenticated, getMe);


module.exports = router;