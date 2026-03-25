const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies-controller");
const authMiddleware = require("../middleware/authentication");

router.get("/home", authMiddleware.isLoggedIn, moviesController.renderHome);

router.get("/movies/add", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.renderAddMovie);
router.post("/movies/add", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.addMovie);


router.get("/movies/edit", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.renderEditMovie);
router.post("/movies/edit", authMiddleware.isLoggedIn, authMiddleware.isAdminUser, moviesController.updateMovie);


router.post("/movies/delete", authMiddleware.isLoggedIn,authMiddleware.isAdminUser,moviesController.deleteMovie);

router.get("/movies/view", authMiddleware.isLoggedIn, moviesController.viewMovieInfo);
router.post("/movies/view", authMiddleware.isLoggedIn, moviesController.updateMovieInfo);

router.get('/watched', authMiddleware.isLoggedIn, moviesController.getWatchedList);
router.post('/watched/delete', authMiddleware.isLoggedIn, moviesController.removeFromWatched);

module.exports = router;