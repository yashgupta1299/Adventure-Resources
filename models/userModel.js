const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email!']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide your password!'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Password do not match'
        }
    }
});

// runs on CREATE and SAVE
userSchema.pre('save', async function(next) {
    // isModified function:
    // Returns true if any of the given paths is modified,
    // else false. If no arguments, returns true if any path
    // in this document is modified.
    if (!this.isModified('password')) return next();

    // hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// instance method available for all documents of a certain collection
userSchema.methods.correctPassword = async function(origPass, hashPass) {
    return await bcrypt.compare(origPass, hashPass);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
