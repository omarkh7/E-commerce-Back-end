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
        validate: [isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",


    },

});

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//        next()
//     }
//     this.password=await bcrypt.hash(this.password,10)
// });

// userSchema.methods.comparePassword = async function (oldPassword) {
//     return await bcrypt.compare(oldPassword, this.password);
// }

const User = mongoose.model('User', userSchema);
module.exports = User;