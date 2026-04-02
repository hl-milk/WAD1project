// Dikshaa

const Movie = require("./../models/movies-model");

const genreOptions = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"];

exports.renderHome = async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.trim() : "";
        const genre = req.query.genre ? req.query.genre.trim() : "all";

        const movies = await Movie.searchAndFilterMovies(search, genre);

        res.render("home", {
            movies: movies,
            genres: genreOptions,
            search: search,
            selectedGenre: genre,
            user: req.session.user,
            success: null
        });
    } catch (error) {
        console.error(error);
        res.redirect("/home?status=databaseerror")
    }
};

exports.renderAddMovie = (req, res) => {
    res.render("add-movie", {
        error: null,
        success: null,
        moviename: "",
        movieid: "",
        description: "",
        genre: "",
        productionCompany: "",
        genres: genreOptions,
        user: req.session.user
    });
};

exports.addMovie = async (req, res) => {
    const moviename = req.body.moviename ? req.body.moviename.trim() : "";
    const movieid = req.body.movieid ? req.body.movieid.trim() : "";
    const description = req.body.description ? req.body.description.trim() : "";
    const genre = req.body.genre ? req.body.genre.trim() : "";
    const productionCompany = req.body.productionCompany ? req.body.productionCompany.trim() : "";

    if (!moviename || !movieid || !description || !genre || !productionCompany) {
        return res.render("add-movie", {
            error: "All fields are required!",
            success: null,
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre,
            productionCompany: productionCompany,
            genres: genreOptions,
            user: req.session.user
        });
    }

    try {
        const existingMovie = await Movie.getMovieById(movieid);

        if (existingMovie) {
            return res.render("add-movie", {
                error: "Movie ID already exists!",
                success: null,
                moviename: moviename,
                movieid: movieid,
                description: description,
                genre: genre,
                productionCompany: productionCompany,
                genres: genreOptions,
                user: req.session.user
            });
        }

        await Movie.addMovieData({
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre,
            productionCompany: productionCompany
        });

        return res.render("add-movie", {
            error: null,
            success: "Movie added successfully!",
            moviename: "",
            movieid: "",
            description: "",
            genre: "",
            productionCompany: "",
            genres: genreOptions,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.redirect("/movies/add?status=databaseerror")
    }
};

exports.renderEditMovie = async (req, res) => {
    const movieid = req.query.movieid;

    if (!movieid) {
        return res.redirect("/movies?status=invalidid");
    }

    try {
        const movie = await Movie.getMovieById(movieid);

        if (!movie) {
            return res.redirect("/movies?status=noid");
        }

        res.render("edit-movie", {
            movie: movie,
            genres: genreOptions,
            error: null,
            success: null,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.redirect(`/movies/edit?movieid=${movieid}?status=databaseerror`);
    }
};

exports.updateMovie = async (req, res) => {
    const movieid = req.body.movieid;
    const moviename = req.body.moviename ? req.body.moviename.trim() : "";
    const description = req.body.description ? req.body.description.trim() : "";
    const genre = req.body.genre ? req.body.genre.trim() : "";
    const productionCompany = req.body.productionCompany ? req.body.productionCompany.trim() : "";

    if (!movieid) {
        return res.redirect("/movies?status=invalidid");
    }

    if (!moviename || !description || !genre || !productionCompany) {
        try {
            const movie = await Movie.getMovieById(movieid);

            return res.render("edit-movie", {
                movie: movie,
                genres: genreOptions,
                error: "All fields are required!",
                success: null,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.redirect(`/movies/edit?movieid=${movieid}?status=databaseerror`);
        }
    }

    try {
        const existingMovie = await Movie.getMovieById(movieid);

        if (!existingMovie) {
            return res.redirect("/home?status=noid");
        }

        const result = await Movie.updateMovieData({
            movieid: movieid,
            moviename: moviename,
            description: description,
            genre: genre,
            productionCompany: productionCompany
        });

        if (!result || result.matchedCount === 0) {
            return res.redirect("/home?status=noid");
        }

        const updatedMovie = await Movie.getMovieById(movieid);

        return res.render("edit-movie", {
            movie: updatedMovie,
            genres: genreOptions,
            error: null,
            success: "Movie updated successfully!",
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.redirect(`/movies/edit?movieid=${movieid}?status=databaseerror`);
    }
};

exports.deleteMovie = async (req, res) => {
    const movieid = req.query.movieid;

    if (!movieid) {
        return res.redirect("/home?status=invalidid");
    }

    try {
        const movie = await Movie.getMovieById(movieid);

        if (!movie) {
            return res.redirect("/home?status=noid");
        }

        const deletedMovieName = movie.moviename;
        const deletedMovieId = movie.movieid;

        await Movie.deleteMovieData(movieid);

        res.render("delete-movie", {
            moviename: deletedMovieName,
            movieid: deletedMovieId,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.redirect(`/movies/edit?movieid=${movieid}?status=databaseerror2`);
    }
};