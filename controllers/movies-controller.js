const Movie = require("../models/movies-model");

exports.renderHome = async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.trim() : "";
        const genre = req.query.genre ? req.query.genre.trim() : "all";

        const movies = await Movie.searchAndFilterMovies(search, genre);
        const genres = await Movie.getDistinctGenres();

        res.render("home", {
            movies: movies,
            genres: genres,
            search: search,
            selectedGenre: genre,
            user: req.session.user
        });

    } catch (error) {
        console.error(error);
        res.send("Error loading home page");
    }
};

exports.renderAddMovie = (req, res) => {
    res.render("add-movie", {
        error: null,
        moviename: "",
        description: "",
        genre: "",
        user: req.session.user
    });
};

exports.addMovie = async (req, res) => {
    const moviename = req.body.moviename ? req.body.moviename.trim() : "";
    const description = req.body.description ? req.body.description.trim() : "";
    const genre = req.body.genre ? req.body.genre.trim() : "";

    if (!moviename || !description || !genre) {
        return res.render("add-movie", {
            error: "All fields are required!",
            moviename: moviename,
            description: description,
            genre: genre,
            user: req.session.user
        });
    }

    try {
        const allMovies = await Movie.getAllMovies();

        let newIdNumber = 1;
        let idExists = true;

        while (idExists) {
            idExists = false;

            for (let i = 0; i < allMovies.length; i++) {
                if (allMovies[i].movieid === "movie" + newIdNumber) {
                    idExists = true;
                    newIdNumber++;
                    break;
                }
            }
        }

        const movieid = "movie" + newIdNumber;

        await Movie.addMovie({
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre
        });

        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error adding movie");
    }
};

exports.renderEditMovie = async (req, res) => {
    const movieid = req.query.movieid;

    if (!movieid) {
        return res.send("Movie ID is required");
    }

    try {
        const movie = await Movie.getMovieById(movieid);

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
    const movieid = req.body.movieid;
    const moviename = req.body.moviename ? req.body.moviename.trim() : "";
    const description = req.body.description ? req.body.description.trim() : "";
    const genre = req.body.genre ? req.body.genre.trim() : "";

    if (!movieid) {
        return res.send("Movie ID is required");
    }

    if (!moviename || !description || !genre) {
        try {
            const movie = await Movie.getMovieById(movieid);

            return res.render("edit-movie", {
                movie: movie,
                error: "All fields are required!",
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            return res.send("Error reading movie database");
        }
    }

    try {
        const updatedMovie = await Movie.updateMovie(movieid, {
            moviename: moviename,
            description: description,
            genre: genre
        });

        if (!updatedMovie) {
            return res.send("Movie not found");
        }

        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error updating movie");
    }
};

exports.deleteMovie = async (req, res) => {
    const movieid = req.query.movieid;

    if (!movieid) {
        return res.send("Movie ID is required");
    }

    try {
        const movie = await Movie.getMovieById(movieid);

        if (!movie) {
            return res.send("Movie not found");
        }

        await Movie.deleteMovie(movieid);
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.send("Error deleting movie");
    }
};