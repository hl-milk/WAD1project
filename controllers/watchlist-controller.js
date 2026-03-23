const User = require('./../models/users-model');
const Movie = require('./../models/movies-model');

exports.renderWatchlist = async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const user = await User.findUser(userEmail);
        const watchlistIds = user.watchlist || [];
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
        res.send("Error adding to watchlist");
    }
};

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
        res.send("Error removing from watchlist");
    }
};
