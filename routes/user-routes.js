const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users-controller")
const authMiddleware = require('../middleware/authentication');

router.get("/login", usersController.renderLogin)
router.post("/login", usersController.loginCheck)

router.get("/register", usersController.renderRegister)
router.post("/register", usersController.registerCheck)

router.get("/account-settings", authMiddleware.isLoggedIn, usersController.renderSettings)
router.post("/account-settings", usersController.updatePass)

router.get("/delete-account", authMiddleware.isLoggedIn, usersController.renderDelete)
router.post("/delete-account", usersController.deleteAccount)

router.get("/logout", usersController.logout)

module.exports = router;