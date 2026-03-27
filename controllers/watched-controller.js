// Minh

const Movie = require("./../models/movies-model");
const User = require("./../models/users-model");

exports.getWatchedList = async (req, res) => {
    try {
        const watchedList = (await User.findUser(req.session.user.email)).watched
        const markedDeleteList = (await User.findUser(req.session.user.email)).watchedDelete
        const safeEmail = req.session.user.email.replace(/\./g, '_dot_')
        const moviesList = [];
        const pendingDelete = [];
        
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

        if (markedDeleteList) {
            const moviesData = await Movie.getFilteredMovies(markedDeleteList);
            moviesData.forEach(movie => {
                pendingDelete.push({
                    movieId: movie.movieid,
                    movieName: movie.moviename
                })
            })
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

        await User.addToWatched(req.session.user._id, movieid)
        res.redirect("/home?status=addedw")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding movie")
    }
}

exports.markForDelete = async (req, res) => {
    try {
        const idToMark = req.body.movieId;
        await User.markWatchedDelete(req.session.user._id, idToMark)
        res.redirect("/watched?status=marked")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error marking the movie for deletion")
    }
}

exports.confirmDelete = async (req, res) => {
    try {
        await User.emptymarkWatchedDelete(req.session.user._id)
        res.redirect("/watched?status=deleted")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movies");
    }
};