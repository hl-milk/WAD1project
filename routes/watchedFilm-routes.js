const express = require('express');
const watchedController = require('../controllers/watchedFilm-controller');
const router = express.Router();

router.get('/watched', watchedController.getWatchedList);
router.post('/watched/delete', watchedController.removeFromWatched);

module.exports = router;