// Yashvardhan
const User = require('./../models/users-model');
const Movie = require('./../models/movies-model');
const Watchlist = require('./../models/watchlist');

exports.renderWatchlist = async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const watchlistEntries = await Watchlist.getWatchlist(userEmail);
        const markedDeleteEntries = await Watchlist.getMarkedDeleteList(userEmail);
        
        const watchlistIds = watchlistEntries.map(e => e.movieid);
        const pendingDeleteIds = markedDeleteEntries.map(e => e.movieid);
        
        const moviesData = await Movie.getMoviesByIds(watchlistIds);
        const markedDeletion = await Movie.getMoviesByIds(pendingDeleteIds)

        // Map movies to include dateAdded
        const moviesWithDate = watchlistEntries.map(entry => {
            const movie = moviesData.find(m => m.movieid === entry.movieid);
            if (movie) {
                return {
                    ...movie.toObject ? movie.toObject() : movie,
                    dateAdded: entry.dateAdded
                };
            }
            return null;
        }).filter(m => m !== null);

        res.render("watchlist", {
            user: req.session.user,
            movies: moviesWithDate,
            markedDeletion: markedDeletion
        });
    } catch (err) {
        console.error(err);
        res.send("Error loading watchlist");
    }
};

exports.addToWatchlist = async (req, res) => {
    try {
        const email = req.session.user.email;
        const movieid = req.query.movieid;
        await Watchlist.addToWatchlist(movieid, email)
        res.redirect("/home?status=addedwl");
    } catch (err) {
        console.error(err);
        res.send("Error adding to watchlist");
    }
};

exports.markForDelete = async (req, res) => {
    try {
        const email = req.session.user.email;
        const movieid = req.query.movieid;
        await Watchlist.markWatchDelete(movieid, email)
        res.redirect("/watchlist?status=marked")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error marking the movie for deletion")
    }
}

exports.removeFromWatchlist = async (req, res) => {
    try {
        const email = req.session.user.email;
        await Watchlist.removeFromWatchlist(email)
        res.redirect("/watchlist?status=removed");
    } catch (err) {
        console.error(err);
        res.send("Error removing from watchlist");
    }
};