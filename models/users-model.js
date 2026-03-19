const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'A user must have an email identifier'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A user must have a password for their account']
    },
    watchlist: {
        type: Array,
        default: []
    },
    reviews: {
        type: Map,
        of: Number,
        default: {}
    }
})

const User = mongoose.model('User', userSchema, 'users');

// Data handling methods for User

exports.findUser = function(email) {
    return User.findOne({email: email});
}

exports.addUser = function(newUser) {
    return User.insertOne(newUser);
}