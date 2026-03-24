const User = require('../models/users-model');
const Movie = require('../models/movies-model'); 

exports.getWatchedList = async (req, res) => {
    try {
        const moviesList = [];
        
        if (req.session.user.watched.length > 0) {
            const moviesData = await Movie.getFilteredMovies(req.session.user.watched);
            moviesData.forEach(movie => {
                let userRating = 0;
                if (movie.ratings && movie.ratings[req.session.user.email]) {
                    userRating = movie.ratings[req.session.user.email];
                }

                moviesList.push({
                    movieId: movie.movieid,       
                    movieName: movie.moviename, 
                    rating: userRating 
                });
            });
        }
        res.render('watched', { moviesList: moviesList });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.removeFromWatched = async (req, res) => {
    try {
        const idToRemove = req.body.movieId; 

        console.log(await User.removeMovieFromWatched(req.session.user.email, idToRemove));

        res.redirect("/watched")

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movie");
    }
};