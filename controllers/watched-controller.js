// Minh

const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");

exports.getWatchedList = async (req, res) => {
    try {
        const watchedList = (await User.findUser(req.session.user.email)).watched
        const safeEmail = req.session.user.email.replace(/\./g, '_dot_')
        const moviesList = [];
        
        if (watchedList) {
            const moviesData = await Movie.getFilteredMovies(watchedList);
            moviesData.forEach(movie => {
                let userRating = 0;
                let userReview;
                if (movie.ratings && movie.ratings[safeEmail]) {
                    userRating = movie.ratings[safeEmail];
                }
                if (movie.reviews && movie.reviews[safeEmail]) {
                    userReview = movie.reviews[safeEmail]
                }

                moviesList.push({
                    movieId: movie.movieid,       
                    movieName: movie.moviename, 
                    rating: userRating,
                    review: userReview
                });
            });
        }
        res.render('watched', { moviesList: moviesList, user: req.session.user });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.addToWatchedList = async (req, res) => {
    try {
        const movieid = req.query.movieid;

        await User.addToWatched(req.session.user._id, movieid)
        res.redirect("/home?status=addedw")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding movie")
    }
}

exports.removeFromWatched = async (req, res) => {
    try {
        const idToRemove = req.body.movieId; 

        await User.removeFromWatched(req.session.user._id, idToRemove);

        res.redirect("/watched?status=deleted")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movie");
    }
};