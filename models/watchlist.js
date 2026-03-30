const mongoose = require('mongoose');

const watchlistsSchema = new mongoose.Schema({
    movieid : {
        type: String,
        required: [true, "A watchlist must be tied to a movie"]
    },
    email: {
        type: String,
        required: [true, "A watchlist must be tied to a user"]
    },
    markDelete: {
        type: Boolean,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Watchlist = mongoose.model('Watchlist', watchlistsSchema, 'watchlists');

exports.addToWatchlist = (movieid, email) => {
    return Watchlist.insertOne({
        movieid: movieid,
        email: email,
        dateAdded: Date.now(),
        markDelete: false
    });
};

exports.markWatchDelete = (movieid, email) => {
    return Watchlist.updateOne(
        { movieid: movieid, email: email },
        { markDelete: true }
    );
};

exports.removeFromWatchlist = (email) => {
    return Watchlist.deleteMany({ email: email, markDelete: true });
};

exports.getWatchlist = (email) => {
    return Watchlist.find({ email: email, markDelete: false }).lean();
};

exports.getMarkedDeleteList = (email) => {
    return Watchlist.find({ email: email, markDelete: true }).lean();
};

exports.getWatchlistEntry = (movieid, email) => {
    return Watchlist.findOne({ movieid: movieid, email: email }).lean();
};

exports.deleteAllForMovie = (movieid) => {
    return Watchlist.deleteMany({ movieid: movieid });
};

exports.deleteAllForUser = (email) => {
    return Watchlist.deleteMany({ email: email });
};