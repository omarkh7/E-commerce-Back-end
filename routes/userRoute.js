const express = require('express');
const { registerUser,
    loginUser,
    getMe,
    getAll,
    deleteUser,
    logoutUser
     } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/userAuthMiddleware');

const router = express.Router();


router.post('/register', registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/delete/:id').delete(deleteUser)
router.get('/getall', isAuthenticated, getAll);
router.get('/me/:id', isAuthenticated, getMe);


module.exports = router;