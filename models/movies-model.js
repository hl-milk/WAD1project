const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    moviename: {
        type: String,
        required: [true, "A movie must have a name"]
    },
    movieid: {
        type: String,
        required: [true, "A movie must have an ID"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "A movie must have a description"]
    },
    genre: {
        type: String,
        required: [true, "A movie must have a genre"]
    },
    ratings: {
        type: Map,
        of: Number,
        default: {}
    },
    reviews: {
        type: Map,
        of: String,
        default: {}
    }
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

exports.getAllMovies = function () {
    return Movie.find().sort({ moviename: 1 });
};

exports.getFilteredMovies = function(movieArr) {
    return Movie.find({movieid: {$in: movieArr}}).lean()
}

exports.getMovieById = function (movieid) {
    return Movie.findOne({ movieid: movieid });
};

exports.searchAndFilterMovies = async function (search, genre) {
    let movies = await Movie.find();

    if (search) {
        const lowerSearch = search.toLowerCase();
        movies = movies.filter(movie =>
            movie.moviename.toLowerCase().includes(lowerSearch)
        );
    }

    if (genre && genre !== "all") {
        movies = movies.filter(movie =>
            movie.genre === genre
        );
    }

    return movies;
};

exports.getDistinctGenres = function () {
    return Movie.distinct("genre");
};

exports.addMovie = function (newMovie) {
    return Movie.create(newMovie);
};

exports.updateMovie = async function (movieid, updatedMovie) {
    const movie = await Movie.findOne({ movieid: movieid });

    if (!movie) return null;

    movie.moviename = updatedMovie.moviename;
    movie.description = updatedMovie.description;
    movie.genre = updatedMovie.genre;

    return movie.save();
};

exports.deleteMovie = function (movieid) {
    return Movie.deleteOne({ movieid: movieid });
};


exports.updateRating = function(movieid,email,rating) {
    return Movie.updateOne(
        { movieid: movieid }, 
        { $set: { [`ratings.${email}`]: rating } } 
    );
    /*
    Think of $set as the "Update or Add" operator in MongoDB.
    Normally, if you tried to update a document without $set, you might accidentally overwrite the entire movie with just a single rating! $set prevents that by targeting only the specific field you care about.

    Here is exactly what it does:
    1. It Updates Existing Info
    If the user alex@gmail.com already has a rating of 3 in your database, and you run $set with a 5, MongoDB will simply overwrite the 3 with a 5.
    2. It Adds New Info (The "Upsert" Behavior)
    If newuser@gmail.com has never rated the movie before, $set notices that the key doesn't exist yet. Instead of failing, it automatically creates that new entry inside your ratings Map.
    */
};

//++need to do an "update review" function

exports.deleteRating = function (movieid,email) {
    return Movie.updateOne(
        { movieid: movieid }, 
        { $unset: { [`ratings.${email}`] : ""} } 
    );
};