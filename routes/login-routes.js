const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller")

router.get("/", usersController.renderLogin)
router.post("/", usersController.loginCheck)

router.get("/register", usersController.renderRegister)

router.post("/register", usersController.registerCheck)

module.exports = router;