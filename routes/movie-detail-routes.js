const express = require("express");
const router = express.Router();
//const blogsController = require("../controllers/blogs-controller")

router.get("/movie", (req, res) => {
    const choice = req.query.id;
    // TODO: fetch database for movie and verify ?id= URL
})

module.exports = router;