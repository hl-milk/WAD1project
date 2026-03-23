const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlist-controller");
const authMiddleware = require("../middleware/authentication");

router.get("/watchlist", authMiddleware.isLoggedIn, watchlistController.renderWatchlist);
router.post("/watchlist/add", authMiddleware.isLoggedIn, watchlistController.addToWatchlist);
router.post("/watchlist/remove", authMiddleware.isLoggedIn, watchlistController.removeFromWatchlist);

module.exports = router;
