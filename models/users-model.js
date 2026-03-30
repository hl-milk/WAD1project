const mongoose = require('mongoose');
const Rating = require('./ratings');
const Review = require('./reviews');
const Watched = require('./watched');
const Watchlist = require('./watchlist');

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
    role: {
        type: String,
        required: [true, 'A user is either an admin or user'],
    },
    dateJoined: {
        type: Date,
        default: Date.now()
    },
    bio: {
        type: String,
        default: ''
    }
})

const User = mongoose.model('User', userSchema, 'users');

// Data handling methods for User

exports.findUser = function(email) {
    return User.findOne({email: email}).lean();
}

exports.findUserById = function(_id) {
    return User.findById(_id).lean();
}

exports.addUser = function(newUser) {
    return User.insertOne(newUser);
}

exports.updateUserPass = function(_id, password) {
    return User.updateOne({_id: _id}, {$set: {password: password}})
}

exports.updateUserBio = function(_id, bio) {
    return User.updateOne({_id: _id}, {$set: {bio: bio}})
}

exports.deleteUser = async function(_id) {
    const user = await User.findById(_id);
    if (user) {
        await Rating.deleteAllForUser(user.email);
        await Review.deleteAllForUser(user.email);
        await Watched.deleteAllForUser(user.email);
        await Watchlist.deleteAllForUser(user.email);
    }
    return User.deleteOne({_id: _id })
}