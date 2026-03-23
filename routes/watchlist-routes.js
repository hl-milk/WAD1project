// routes/watchlist-routes.js
const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlist-controller");
const authMiddleware = require("../middleware/authentication");

// View my watchlist
router.get("/watchlist", authMiddleware.isLoggedIn, watchlistController.renderWatchlist);

// Add movie to watchlist
router.post("/watchlist/add", authMiddleware.isLoggedIn, watchlistController.addToWatchlist);

// Remove movie from watchlist
router.post("/watchlist/remove", authMiddleware.isLoggedIn, watchlistController.removeFromWatchlist);

module.exports = router;
