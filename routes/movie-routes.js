// routes/movie-routes.js
const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies-controller");
const authMiddleware = require("../middleware/authentication");

// Home page (list + search + filter)
router.get("/home", authMiddleware.isLoggedIn, moviesController.renderHome);

// Add movie
router.get("/movies/add", authMiddleware.isLoggedIn, moviesController.renderAddMovie);
router.post("/movies/add", authMiddleware.isLoggedIn, moviesController.addMovie);

// Edit movie
router.get("/movies/edit", authMiddleware.isLoggedIn, moviesController.renderEditMovie);
router.post("/movies/edit", authMiddleware.isLoggedIn, moviesController.updateMovie);

// Delete movie
router.post("/movies/delete", authMiddleware.isLoggedIn, moviesController.deleteMovie);

module.exports = router;
