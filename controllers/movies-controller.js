const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");

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

exports.viewMovieInfo = async (req, res) => {
    const email = req.session.user
    const selectedMovieid = req.query.movieid
    const movie = await Movie.getMovieById(selectedMovieid);
    const user = await User.findUser(email)
    

    //ratings retrieval and calculation
    const ratings = movie.ratings;
    let ratingSum = 0;
    let ratingCount = 0;
    let myRating = null
    if(movie.ratings){
        for(let value of ratings.values()){
        ratingCount+=1
        ratingSum += value;
        }
        const safeEmail = email.replace(/\./g, '_dot_');
        myRating = ratings.get(safeEmail);
    }
    
    
    let avgRating = ratingCount>0? (ratingSum/ratingCount).toFixed(2):0

    //packaging movie details for render
    let selectedMovie = 
    {
        title : movie.moviename,
        description: movie.description,
        avgRating: avgRating||0,
        ratingCount: ratingCount||0,
        reviews: movie.reviews,
        selectedMovieid: selectedMovieid
    }

    //packaging user info and user-specific movie details for render
    let currentUser = 
    {
        email: email,
        isAdmin: (user && user.role == "admin") ? true : false,
        inWatchlist : (user && user.watchlist) ? user.watchlist.includes(selectedMovieid): false,
        isWatched : (user && user.watched) ? user.watched.includes(selectedMovieid):false,
        rating : myRating||null,
        review : 'xxx xxxx xxx x xxx xxxx xxx.'||null //NEED TO FILL IN PROPERLY!!
    }
    res.render("movie",{movie:selectedMovie, user:currentUser})
};


exports.updateMovieInfo = async (req, res) => {
    const email = req.session.user;
    if (!email) {
        // If not logged in, send them to login or show an error
        return res.redirect("/login"); 
    }

    const movieid = req.body.movieid;
    const watched = req.body.watched;
    const watchlist = req.body.watchlist;
    const myRating = req.body.rating;
    const myReview = req.body.review;
    
    //MovieDB:
    if (!myRating|| myRating == ""){
        await Movie.deleteRating(movieid,email) 
    } else{
        await Movie.updateRating(movieid,email,parseInt(myRating))
    }
    
    //++for reviews

    const user = await User.findUser(email)
    if (!user) {
        return res.redirect("/login"); 
    }
    //UserDB:
    const userId = user._id
    if(watchlist == "on"){
        await User.addToWatchlist(userId,movieid)
    } else{
        await User.removeFromWatchlist(userId,movieid)
    }

    if(watched == "on"){
        await User.addToWatched(userId,movieid)
    } else{
        await User.removeFromWatched(userId,movieid)
    }


    //after updating the database, refresh the page
    res.redirect(`/movies/view?movieid=${movieid}`);


};
