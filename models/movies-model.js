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
    }
});

const Movie = mongoose.model("Movie", movieSchema, "movies");

exports.getAllMovies = function () {
    return Movie.find().sort({ moviename: 1 });
};

exports.getMovieById = function (movieid) {
    return Movie.findOne({ movieid: movieid });
};

exports.searchAndFilterMovies = async function (search, genre) {
    let movies = await Movie.find();

    if (search) {
        const lowerSearch = search.toLowerCase();
        movies = movies.filter(movie =>
            movie.moviename &&
            movie.moviename.toLowerCase().includes(lowerSearch)
        );
    }

    if (genre && genre !== "all") {
        const lowerGenre = genre.toLowerCase();
        movies = movies.filter(movie =>
            movie.genre &&
            movie.genre.toLowerCase() === lowerGenre
        );
    }

    return movies;
};

exports.addMovieData = function (newMovie) {
    return Movie.create(newMovie);
};

exports.updateMovieData = function (movieObject) {
    return Movie.updateOne(
        { movieid: movieObject.movieid },
        {
            $set: {
                moviename: movieObject.moviename,
                description: movieObject.description,
                genre: movieObject.genre
            }
        }
    );
};

exports.deleteMovieData = function (movieid) {
    return Movie.deleteOne({ movieid: movieid });
};