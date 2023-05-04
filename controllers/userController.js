const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");

// ================================REGISTER USER==============================
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, location, phoneNumber } = req.body;

  if (!fullName || !email || !password || !location || !phoneNumber) {
    res.status(400).send({ message: "Please add all fields" });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    res.status(400).send({ message: "Please enter a valid email address" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // ================================CREATE USER REGISTER==============================
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    location,
    phoneNumber,

  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    res.status(400).send({ message: "Invalid user data" });
  }
  // res.status(400).send({ message: "succesfully registered" });
});

// ================================LOGIN USER==============================

// // @route Post/admin/login

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for admin email
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({
            errors: [{
              password:
                "incorrect"
            }]
          });
        } else {
          res.json({
            token: generateToken(user._id),
            role: user.role
          })
        }
      })
    }
  })
})


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET);
};
// ================================LOGOUT==============================
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});

// ================================DELETE USER==============================
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// ================================GET ME==============================
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});
// ================================GET ALL==============================

const getAll = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.json({ message: "Admin data display", user });
});

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  logoutUser,
  getMe,
  getAll,
};
