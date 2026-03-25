const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlist-controller");
const authMiddleware = require("../middleware/authentication");

router.get("/watchlist", authMiddleware.isLoggedIn, async (req, res) => {
    // call controller, but make sure it can read req.query.msg
    return watchlistController.renderWatchlist(req, res);
});

router.post("/watchlist/add", authMiddleware.isLoggedIn, watchlistController.addToWatchlist);
router.post("/watchlist/remove", authMiddleware.isLoggedIn, watchlistController.removeFromWatchlist);
router.post("/watchlist/watched", authMiddleware.isLoggedIn, watchlistController.markAsWatched);


module.exports = router;
