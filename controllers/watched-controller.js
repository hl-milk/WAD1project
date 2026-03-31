// Minh

const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");
const Watched = require("./../models/watched");
const Rating = require("./../models/ratings");
const Review = require("./../models/reviews");

exports.getWatchedList = async (req, res) => {
    try {
        const email = req.session.user.email;
        const watchedEntries = await Watched.getWatchedList(email);
        const markedDeleteEntries = await Watched.getMarkedDeleteList(email);
        
        const moviesList = [];
        const pendingDelete = [];
        
        for (let entry of watchedEntries) {
            const movie = await Movie.getMovieById(entry.movieid);
            if (movie) {
                const ratingEntry = await Rating.getRating(entry.movieid, email);
                const reviewEntry = await Review.getReview(entry.movieid, email);
                
                moviesList.push({
                    movieId: movie.movieid,       
                    movieName: movie.moviename, 
                    rating: ratingEntry ? ratingEntry.rating : 0,
                    review: reviewEntry ? reviewEntry.review : undefined,
                    dateAdded: entry.dateAdded
                });
            }
        }

        for (let entry of markedDeleteEntries) {
            const movie = await Movie.getMovieById(entry.movieid);
            if (movie) {
                pendingDelete.push({
                    movieId: movie.movieid,
                    movieName: movie.moviename
                });
            }
        }
        
        res.render('watched', { moviesList: moviesList, markedDeletion: pendingDelete, user: req.session.user });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.addToWatchedList = async (req, res) => {
    try {
        const movieid = req.query.movieid;
        const email = req.session.user.email;

        const existing = await Watched.getWatchedEntry(movieid, email);
        if (existing && !existing.markDelete) {
            return res.redirect("/home?status=exists_watched");
        }

        await Watched.addToWatched(movieid, email)
        res.redirect("/home?status=addedw")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding movie")
    }
}

exports.markForDelete = async (req, res) => {
    try {
        const movieid = req.body.movieId;
        const email = req.session.user.email;
        await Watched.markWatchedDelete(movieid, email)
        res.redirect("/watched?status=marked")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error marking the movie for deletion")
    }
}

exports.confirmDelete = async (req, res) => {
    try {
        const email = req.session.user.email;
        await Watched.emptymarkWatchedDelete(email)
        res.redirect("/watched?status=deleted")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movies");
    }
};