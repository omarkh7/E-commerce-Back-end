const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');



const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, password, Location, phoneNumber } = req.body

    if (!fullName || !email || !password  || !Location || !phoneNumber) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exist')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create admin
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        Location,
        phoneNumber
       
    })
    if (user) {
        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
    res.json({ message: 'Register User' })
});

// @route Post/admin/login

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check for admin email
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            // _id: user.id,
            // fullName: user.fullName,
            // email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).send({ message: 'Invalid credentials' });
    }
});


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE });
};

const getMe = asyncHandler(async (req, res) => {

    const user =await User.find()
    res.json({ message: 'Admin data display',user });
});


module.exports = { loginUser, registerUser ,getMe};
