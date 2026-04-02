const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies-controller");
const moviesInfoController = require("../controllers/moviesinfo-controller");
const watchedController = require("../controllers/watched-controller");
const watchlistController = require("../controllers/watchlist-controller")
const authMiddleware = require("../middleware/authentication");

router.get("/home", authMiddleware.isLoggedIn, moviesController.renderHome);

router.get("/movies/add", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.renderAddMovie);
router.post("/movies/add", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.addMovie);

router.get("/movies/edit", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.renderEditMovie);
router.post("/movies/edit", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.updateMovie);

router.post("/movies/delete", authMiddleware.isLoggedIn, authMiddleware.isAdminUser,moviesController.deleteMovie);

router.get("/movies/view", authMiddleware.isLoggedIn, moviesInfoController.viewMovieInfo);
router.post("/movies/view", authMiddleware.isLoggedIn, moviesInfoController.updateMovieInfo);

router.get('/watched', authMiddleware.isLoggedIn, watchedController.getWatchedList);
router.post('/watched/add', authMiddleware.isLoggedIn, watchedController.addToWatchedList)
router.post('/watched/markdelete', authMiddleware.isLoggedIn, watchedController.markForDelete);
router.post('/watched/delete', authMiddleware.isLoggedIn, watchedController.confirmDelete)

router.get("/watchlist", authMiddleware.isLoggedIn, watchlistController.renderWatchlist);
router.post("/watchlist/add", authMiddleware.isLoggedIn, watchlistController.addToWatchlist);
router.post("/watchlist/mark", authMiddleware.isLoggedIn, watchlistController.markForDelete);
router.post("/watchlist/remove", authMiddleware.isLoggedIn, watchlistController.removeFromWatchlist);

router.post("/deleteReviews", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesInfoController.deleteReviews)

module.exports = router;