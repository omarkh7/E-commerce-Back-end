const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            //get user from token
            const user = await User.findOne(
                decoded._id
                );

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

              // Check user's role
              if (!user.role || !allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            } 
            req.user = user

            next();
        } catch (error) {
            console.log(error);
            res.send({ status: 401, message: 'Not authorized, no token' });
        }
    }

    if (!token) {
        res.send({ status: 401, message: 'Not authorized, no token' });
    }
});



