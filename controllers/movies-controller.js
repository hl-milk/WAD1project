const Movie = require("./../models/movies-model");

function isAdminUser(req) {
    return req.session.user && req.session.user.role === "admin";
}

exports.renderHome = async (req, res) => {
    const search = req.query.search || "";
    const genre = req.query.genre || "all";

    try {
        const movies = await Movie.searchAndFilterMovies(search, genre);
        const genres = await Movie.getDistinctGenres();

        res.render("home", {
            movies: movies,
            search: search,
            genre: genre,
            genres: genres,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.send("Error reading movie database");
    }
};

exports.renderAddMovie = (req, res) => {
    if (!isAdminUser(req)) {
        return res.send("Access denied. Admin only.");
    }

    res.render("add-movie", {
        error: null,
        user: req.session.user
    });
};

exports.addMovie = async (req, res) => {
    if (!isAdminUser(req)) {
        return res.send("Access denied. Admin only.");
    }

    const moviename = req.body.moviename;
    const movieid = req.body.movieid;
    const description = req.body.description;
    const genre = req.body.genre;

    if (!moviename || !movieid || !description || !genre) {
        return res.render("add-movie", {
            error: "All fields are required!",
            user: req.session.user
        });
    }

    try {
        const existingMovie = await Movie.getMovieById(movieid);

        if (existingMovie) {
            return res.render("add-movie", {
                error: "Movie ID already exists!",
                user: req.session.user
            });
        }

        const newMovie = {
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre,
            ratings: {}
        };

        await Movie.addMovie(newMovie);
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error adding movie");
    }
};

exports.renderEditMovie = async (req, res) => {
    if (!isAdminUser(req)) {
        return res.send("Access denied. Admin only.");
    }

    try {
        const movie = await Movie.getMovieById(req.query.movieid);

        if (!movie) {
            return res.send("Movie not found");
        }

        res.render("edit-movie", {
            movie: movie,
            error: null,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.send("Error reading movie database");
    }
};

exports.updateMovie = async (req, res) => {
    if (!isAdminUser(req)) {
        return res.send("Access denied. Admin only.");
    }

    const moviename = req.body.moviename;
    const description = req.body.description;
    const genre = req.body.genre;

    if (!moviename || !description || !genre) {
        const movie = await Movie.getMovieById(req.query.movieid);

        return res.render("edit-movie", {
            movie: movie,
            error: "All fields are required!",
            user: req.session.user
        });
    }

    try {
        await Movie.updateMovie(req.query.movieid, {
            moviename: moviename,
            description: description,
            genre: genre
        });

        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error updating movie");
    }
};

exports.deleteMovie = async (req, res) => {
    if (!isAdminUser(req)) {
        return res.send("Access denied. Admin only.");
    }

    try {
        await Movie.deleteMovie(req.query.movieid);
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error deleting movie");
    }
};