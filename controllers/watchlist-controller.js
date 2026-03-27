// Yashvardhan
const User = require('./../models/users-model');
const Movie = require('./../models/movies-model');

exports.renderWatchlist = async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const user = await User.findUser(userEmail);
        const watchlistIds = user.watchlist || [];
        const pendingDelete = user.watchDelete || [];
        const movies = await Movie.getMoviesByIds(watchlistIds);
        const markedDeletion = await Movie.getMoviesByIds(pendingDelete)

        res.render("watchlist", {
            user: req.session.user,
            movies: movies,
            markedDeletion: markedDeletion
        });
    } catch (err) {
        console.error(err);
        res.send("Error loading watchlist");
    }
};

exports.addToWatchlist = async (req, res) => {
    try {
        await User.addToWatchlist(req.session.user._id, req.query.movieid)
        res.redirect("/home?status=addedwl");
    } catch (err) {
        console.error(err);
        res.send("Error adding to watchlist");
    }
};

exports.markForDelete = async (req, res) => {
    try {
        const idToMark = req.query.movieid;
        await User.markWatchDelete(req.session.user._id, idToMark)
        res.redirect("/watchlist?status=marked")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error marking the movie for deletion")
    }
}

exports.removeFromWatchlist = async (req, res) => {
    try {
        await User.removeFromWatchlist(req.session.user._id, req.query.movieid)
        res.redirect("/watchlist?status=removed");
    } catch (err) {
        console.error(err);
        res.send("Error removing from watchlist");
    }
};