const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    movieid : {
        type: String,
        required: [true, "A review must be tied to a movie"]
    },
    email: {
        type: String,
        required: [true, "A review must be tied to a user"]
    },
    review: {
        type: String
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', reviewsSchema, 'reviews');

exports.updateReview = (movieid, email, review) => {
    return Review.updateOne(
        { movieid: movieid, email: email },
        { 
            review: review,
            reviewDate: Date.now()
        },
        { upsert: true }
    );
};

exports.deleteReview = (movieid, email) => {
    return Review.deleteOne({ movieid: movieid, email: email });
};

exports.getMovieReviews = (movieid) => {
    return Review.find({ movieid: movieid }).lean();
};

exports.getReview = (movieid, email) => {
    return Review.findOne({ movieid: movieid, email: email }).lean();
};

exports.deleteAllForMovie = (movieid) => {
    return Review.deleteMany({ movieid: movieid });
};

exports.deleteAllForUser = (email) => {
    return Review.deleteMany({ email: email });
};