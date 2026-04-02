const mongoose = require('mongoose');

const watchedSchema = new mongoose.Schema({
    movieid : {
        type: String,
        required: [true, "A watched must be tied to a movie"]
    },
    email: {
        type: String,
        required: [true, "A watched must be tied to a user"]
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

const Watched = mongoose.model('Watched', watchedSchema, 'watched');

exports.addToWatched = (movieid, email) => {
    return Watched.updateOne(
        {movieid: movieid, email: email},
        {dateAdded: Date.now(), markDelete: false}, 
        {upsert: true}
)};

exports.markWatchedDelete = (movieid, email) => {
    return Watched.updateOne(
        { movieid: movieid, email: email },
        { markDelete: true }
    );
};

exports.emptymarkWatchedDelete = (email) => {
    return Watched.deleteMany({ email: email, markDelete: true });
};

exports.getWatchedList = (email) => {
    return Watched.find({ email: email, markDelete: false }).lean();
};

exports.getMarkedDeleteList = (email) => {
    return Watched.find({ email: email, markDelete: true }).lean();
};

exports.getWatchedEntry = (movieid, email) => {
    return Watched.findOne({ movieid: movieid, email: email }).lean();
};

exports.deleteAllForMovie = (movieid) => {
    return Watched.deleteMany({ movieid: movieid });
};

exports.deleteAllForUser = (email) => {
    return Watched.deleteMany({ email: email });
};