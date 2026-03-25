const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");

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
        res.send("Error loading home page");
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
        genres: genreOptions,
        user: req.session.user
    });
};

exports.addMovie = async (req, res) => {
    const moviename = req.body.moviename ? req.body.moviename.trim() : "";
    const movieid = req.body.movieid ? req.body.movieid.trim() : "";
    const description = req.body.description ? req.body.description.trim() : "";
    const genre = req.body.genre ? req.body.genre.trim() : "";

    if (!moviename || !movieid || !description || !genre) {
        return res.render("add-movie", {
            error: "All fields are required!",
            success: null,
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre,
            genres: genreOptions,
            user: req.session.user
        }); // REDUNDANT, ALL FIELDS ARE SET TO REQUIRED
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
                genres: genreOptions,
                user: req.session.user
            }); // To keep
        }

        await Movie.addMovieData({
            moviename: moviename,
            movieid: movieid,
            description: description,
            genre: genre
        });

        return res.render("add-movie", {
            error: null,
            success: "Movie added successfully!",
            moviename: "",
            movieid: "",
            description: "",
            genre: "",
            genres: genreOptions,
            user: req.session.user
        });
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
            genres: genreOptions,
            error: null,
            success: null,
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
                genres: genreOptions,
                error: "All fields are required!",
                success: null,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            return res.send("Error reading movie database");
        }
    }

    try {
        const existingMovie = await Movie.getMovieById(movieid);

        if (!existingMovie) {
            return res.send("Movie not found");
        }

        const result = await Movie.updateMovieData({
            movieid: movieid,
            moviename: moviename,
            description: description,
            genre: genre
        });

        if (!result || result.matchedCount === 0) {
            return res.send("Movie not found");
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

        const deletedMovieName = movie.moviename;
        const deletedMovieId = movie.movieid;

        await Movie.deleteMovieData(movieid);
        await User.massRemoveFromWatched(movieid);

        res.render("delete-movie", {
            moviename: deletedMovieName,
            movieid: deletedMovieId,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.send("Error deleting movie");
    }
};

exports.viewMovieInfo = async (req, res) => {
    const email = req.session.user.email
    const selectedMovieid = req.query.movieid
    const movie = await Movie.getMovieById(selectedMovieid);
    const user = await User.findUser(email)

    //ratings retrieval and calculation
    const ratings = movie.ratings;
    let ratingSum = 0;
    let ratingCount = 0;
    for(let value of Object.values(ratings)){
        ratingCount+=1
        ratingSum += value;
    }
    const safeEmail = email.replace(/\./g, '_dot_');
    let myRating = ratings[safeEmail];
    let avgRating = ratingCount>0? (ratingSum/ratingCount).toFixed(2):0

    //packaging movie details for render
    let selectedMovie = 
    {
        selectedMovieid : selectedMovieid,
        title : movie.moviename,
        description: movie.description,
        avgRating: avgRating||0,
        ratingCount: ratingCount||0,
        reviews: movie.reviews
    }

    //packaging user info and user-specific movie details for render
    let currentUser = 
    {
        email: email,
        role: req.session.user.role,
        isAdmin: (user && user.role == "admin") ? true : false,
        inWatchlist : (user && user.watchlist) ? user.watchlist.includes(selectedMovieid) : false,
        isWatched : (user && user.watched) ? user.watched.includes(selectedMovieid) : false,
        rating : myRating|| null,
        review : movie.reviews ? movie.reviews[safeEmail] || null : null // gets a user's review for a movie, or returns null if the movie has no reviews / the user hasn't reviewed it
    }
    res.render("movie", {movie:selectedMovie, user:currentUser})
    };

exports.updateMovieInfo = async (req, res) => {
    const email = req.session.user.email;
    const movieid = req.body.movieid;
    const watched = req.body.watched;
    const watchlist = req.body.watchlist;
    const myRating = req.body.rating;
    const myReview = req.body.review;
        
    //MovieDB:
    if (!myRating|| myRating == ""){
        await Movie.deleteRating(movieid,email) 
    } else {
        await Movie.updateRating(movieid,email,parseInt(myRating))
    }
        
    //ReviewDB:
    if (!myReview || myReview.trim() === ""){
        await Movie.deleteReview(movieid, email);
    } else {
        await Movie.updateReview(movieid, email, myReview.trim());
    }
        // to catch blank submissions and keep stored data clean
    
    
    //UserDB:
    const user = await User.findUser(email)
    const userId = user._id
    if(watchlist == "on"){
        await User.addToWatchlist(userId,movieid)
    } else {
        await User.removeFromWatchlist(userId,movieid)
    }
    if(watched == "on"){
        await User.addToWatched(userId,movieid)
    } else {
        await User.removeFromWatched(userId,movieid)
    }
    
    
    //after updating the database, refresh the page
    res.redirect(`/movies/view?movieid=${movieid}`);
    };