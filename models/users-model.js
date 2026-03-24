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
    },
    role: {
        type: String,
        required: [true, 'A user is either an admin or user'],
        default: 'user'
    }
})

const User = mongoose.model('User', userSchema, 'users');

// Data handling methods for User

exports.findUser = function(email) {
    return User.findOne({email: email}).lean();
}

exports.addUser = function(newUser) {
    return User.insertOne(newUser);
}

exports.updateUserPass = function(_id, password) {
    return User.updateOne({_id: _id}, {$set: {password: password}})
}

exports.deleteUser = function(_id) {
    return User.deleteOne({_id: _id })
}

//-----------------
exports.removeFromWatchlist = async function (_id,movieid){
    return await User.updateOne(
        { _id: _id }, 
        { $pull: { watchlist: movieid } } 
    );
};

exports.addToWatchlist = async function (_id,movieid){
    return await User.updateOne(
        { _id: _id }, 
        { $addToSet: { watchlist: movieid } } 
    );
};

exports.removeFromWatched = async function (_id,movieid){
    return await User.updateOne(
        { _id: _id }, 
        { $pull: { watched: movieid } } 
    );
};

exports.addToWatched = async function (_id,movieid){
    return await User.updateOne(
        { _id: _id }, 
        { $addToSet: { watched: movieid } } 
    );
};