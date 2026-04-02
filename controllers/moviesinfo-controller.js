// Cesar and Noah

const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");
const Rating = require("./../models/ratings");
const Review = require("./../models/reviews");
const Watched = require("./../models/watched");
const Watchlist = require("./../models/watchlist");

exports.viewMovieInfo = async (req, res) => {
    try {
        const email = req.session.user.email
        const selectedMovieid = req.query.movieid
        const movie = await Movie.getMovieById(selectedMovieid);
        const user = await User.findUser(email)

        //ratings retrieval and calculation
        const allRatings = await Rating.getMovieRatings(selectedMovieid);
        const allReviews = await Review.getMovieReviews(selectedMovieid);
        
        let ratingSum = 0;
        let ratingCount = allRatings.length;
        for(let r of allRatings){
            ratingSum += r.rating;
        }
        
        let myRatingEntry = await Rating.getRating(selectedMovieid, email);
        let myRating = myRatingEntry ? myRatingEntry.rating : null;
        let avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : 0

        // For backwards compatibility and EJS simplification, we'll keep a map for text lookup 
        // but also pass the full array for detailed display (like dates).
        const reviewsMap = {};
        allReviews.forEach(rev => {
            reviewsMap[rev.email] = rev.review;
        });

        //packaging movie details for render
        let selectedMovie = 
        {
            selectedMovieid : selectedMovieid,
            title : movie.moviename,
            description: movie.description,
            productionCompany: movie.productionCompany,
            avgRating: avgRating||0,
            ratingCount: ratingCount||0,
            reviews: allReviews // Pass the full array now
        }

        let watchedEntry = await Watched.getWatchedEntry(selectedMovieid, email);
        let watchlistEntry = await Watchlist.getWatchlistEntry(selectedMovieid, email);

        //packaging user info and user-specific movie details for render
        let currentUser = 
        {
            email: email,
            role: req.session.user.role,
            isAdmin: (user && user.role == "admin") ? true : false,
            inWatchlist : (watchlistEntry && !watchlistEntry.markDelete) ? true : false,
            isWatched : (watchedEntry && !watchedEntry.markDelete) ? true : false,
            rating : myRating|| null,
            review : reviewsMap[email] || null 
        }
        res.render("movie", {movie:selectedMovie, user:currentUser, query: req.query});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading movie page.");
    }
};

exports.updateMovieInfo = async (req, res) => {
    const email = req.session.user.email;
    const movieid = req.body.movieid;
    const myRating = req.body.rating;
    const myReview = req.body.review;
    const deleteAll = req.body.deleteAll;
    
    // If delete button was clicked, skip validation and delete both
    if (deleteAll === "true") {
        await Rating.deleteRating(movieid, email);
        await Review.deleteReview(movieid, email);
        return res.redirect(`/movies/view?movieid=${movieid}`);
    }

    // At least one of rating or review must be filled
    if ((!myRating || myRating === "") && (!myReview || myReview.trim() === "")) {
        return res.redirect(`/movies/view?movieid=${movieid}&error=Please enter at least a rating or a review.`);
    }
        
    //MovieDB:
    if (!myRating|| myRating == ""){
        await Rating.deleteRating(movieid,email) 
    } else {
        await Rating.updateRating(movieid,email,parseInt(myRating))
    }
        
    //ReviewDB:
    if (!myReview || myReview.trim() === ""){
        await Review.deleteReview(movieid, email);
    } else {
        await Review.updateReview(movieid, email, myReview.trim());
    }
    
    //after updating the database, refresh the page
    res.redirect(`/movies/view?movieid=${movieid}`);
};

exports.deleteReviews = async (req,res) =>{
    const user = req.session.user

    const usersToDeleteReviews = req.body.usersToDeleteReviews;
    const movieid = req.body.movieid
    if(usersToDeleteReviews){
        const deleteList = Array.isArray(usersToDeleteReviews) ? usersToDeleteReviews : [usersToDeleteReviews];
        for(let emailToDelete of deleteList){
                await Review.deleteReview(movieid, emailToDelete);
            }

        }
        
        res.redirect(`/movies/view?movieid=${movieid}`)
    }