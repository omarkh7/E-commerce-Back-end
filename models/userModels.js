const mongoose = require('mongoose');

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
    },
    password: {
        type: String,
        required: true
    },
    validate_password: {
        validate: {
            validator: () => Promise.resolve(false),
            message: 'password validation failed'
        }
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
        type: [{
            type: String,
            enum: ["user", "admin"],
            default: ["user"]
        }
        ]
    },

});

const User = mongoose.model('User', userSchema);
module.exports = User;