const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
    movieid : {
        type: String,
        required: [true, "A rating must be tied to a movie"]
    },
    email: {
        type: String,
        required: [true, "A rating must be tied to a user"]
    },
    rating: {
        type: Number
    },
    ratingDate: {
        type: Date,
        default: Date.now
    }
})

const Rating = mongoose.model('Rating', ratingsSchema, 'ratings');

exports.updateRating = (movieid, email, rating) => {
    return Rating.updateOne(
        { movieid: movieid, email: email },
        { 
            rating: rating,
            ratingDate: Date.now()
        },
        { upsert: true }
    );
};

exports.deleteRating = (movieid, email) => {
    return Rating.deleteOne({ movieid: movieid, email: email });
};

exports.getMovieRatings = (movieid) => {
    return Rating.find({ movieid: movieid }).lean();
};

exports.getRating = (movieid, email) => {
    return Rating.findOne({ movieid: movieid, email: email }).lean();
};

exports.deleteAllForMovie = (movieid) => {
    return Rating.deleteMany({ movieid: movieid });
};

exports.deleteAllForUser = (email) => {
    return Rating.deleteMany({ email: email });
};