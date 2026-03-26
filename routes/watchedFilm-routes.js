const express = require('express');
const watchedController = require('../controllers/watchedFilm-controller');
const router = express.Router();

router.get('/watched', watchedController.getWatchedList);
router.post('/trash', watchedController.moveToTrash);
router.post('/empty-trash', watchedController.emptyTrash)

module.exports = router;