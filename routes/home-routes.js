const express = require("express");
const router = express.Router();
//const blogsController = require("../controllers/blogs-controller")

router.get("/", (req, res) => {
    res.render("login", {e: null})
})

router.post("/home", (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (!user || !pass) {return res.render("login", {e: "All fields are required."})}
    //TODO: check if user exists in database, if exists: render /home page, else render login
    res.render("home", )
})

module.exports = router;