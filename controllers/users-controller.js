const User = require('./../models/users-model');

// Controller function to handle User data
exports.renderLogin = (req, res) => {
    res.render("login", {e: null})
}

exports.loginCheck = async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (!user || !pass) {return res.render("login", {e: "All fields are required!"})}
    if (user && pass) {
        try {
            let result = await User.findUser(user)
            if (result) {res.render("home", {})} else {res.render("login", {e: "Invalid account!"})} //TODO: Add the homepage render
        } catch (e) {
            console.error(e)
            res.send("Error reading database")
        }
    }
}

exports.renderRegister = (req, res) => {
    res.render("register", {e: null})
}

exports.registerCheck = async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    const cpass = req.body.cpass;
    if (!user || !pass) {return res.render("register", {e: "All fields are required!"})}
    if (user && pass && pass === cpass) {
        let newUser = {
            email: user,
            password: pass,
            reviews: {}
        };

        try {
            let result = await User.addUser(newUser);
            res.render("register", {e: 1})
            console.log(result)
        } catch (e) {
            console.error(e)
            res.send("Error reading database")
        }
    } else {
        return res.render("register", {e: "Passwords do not match!"})
    }
}