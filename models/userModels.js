const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:[isEmail,'Please enter a valid email.']
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        
        
    },

});



const User = mongoose.model('User', userSchema);
module.exports = User;