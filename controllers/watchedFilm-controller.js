const User = require('../models/users-model');
const Movie = require('../models/movies-model'); 

exports.getWatchedList = async (req, res) => {
    try {
        const currentUser = await User.findUser(req.session.user.email);
        const activeMovies = [];
        const trashMovies = [];
        if (currentUser) {
            if (currentUser.watched && currentUser.watched.length > 0) {
                const moviesData = await Movie.getFilteredMovies(currentUser.watched);
                moviesData.forEach(movie => {
                    let userRating = 0;
                    if (movie.ratings && movie.ratings[currentUser.email]) {
                        userRating = movie.ratings[currentUser.email];
                    }

                    activeMovies.push({
                        movieId: movie.movieid,       
                        movieName: movie.moviename, 
                        rating: userRating 
                    });
                });
            } 
        if (currentUser.watcheddelete && currentUser.watcheddelete.length > 0) {
            const trashData = await Movie.getFilteredMovies(currentUser.watcheddelete);
            trashData.forEach(movie => {
                trashMovies.push({
                    movieId : movie.movieid,
                    movieName : movie.movieName
                });
            });
        };
        res.render('watched', {activeMovies : activeMovies, trashMovies : trashMovies})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.moveToTrash = async (req, res) => {
    try {
        const idToRemove = req.body.movieId; 

        console.log(await User.moveToTrash(req.session.user.email, idToRemove));

        res.redirect("/watched");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error moving to deleted movie");
    }
};

exports.emptyTrash = async (req, res) => {
    try {
        console.log(await User.emptyTrash(req.session.user.email));
        res.redirect('/watched');
    } catch (error)  {
        console.log(error);
        res.status(500).send("Error emptying deleted movie list")
    }
}