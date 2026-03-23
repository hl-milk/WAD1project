// controllers/watchlist-controller.js
const User = require('./../models/users-model');
const Movie = require('./../models/movies-model');

// GET /watchlist - show current user's watchlist
exports.renderWatchlist = async (req, res) => {
    try {
        const userEmail = req.session.user.email;

        // Get the latest user data from DB
        const user = await User.findUser(userEmail);

        const watchlistIds = user.watchlist || [];

        // Find movies where movieid is in user's watchlist
        const movies = await Movie.getMoviesByIds(watchlistIds);

        res.render("watchlist", {
            user: req.session.user,
            movies: movies
        });
    } catch (err) {
        console.error(err);
        res.send("Error loading watchlist");
    }
};

// POST /watchlist/add?movieid=...
exports.addToWatchlist = async (req, res) => {
    try {
        const movieid = req.query.movieid;
        const userEmail = req.session.user.email;

        const user = await User.findUser(userEmail);

        if (!user.watchlist.includes(movieid)) {
            user.watchlist.push(movieid);
            await user.save();
        }

        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.send("Error adding movie to watchlist");
    }
};

// POST /watchlist/remove?movieid=...
exports.removeFromWatchlist = async (req, res) => {
    try {
        const movieid = req.query.movieid;
        const userEmail = req.session.user.email;

        const user = await User.findUser(userEmail);

        user.watchlist = user.watchlist.filter(id => id !== movieid);
        await user.save();

        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.send("Error removing movie from watchlist");
    }
};

//Notes:
//We are referencing movieid (your schema field) not _id.
//We rely on User.findUser(email) which already exists.
