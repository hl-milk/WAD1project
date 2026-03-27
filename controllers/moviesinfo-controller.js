// Cesar and Noah

const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");

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
    
    //after updating the database, refresh the page
    res.redirect(`/movies/view?movieid=${movieid}`);
    };