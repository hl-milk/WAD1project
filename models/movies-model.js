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