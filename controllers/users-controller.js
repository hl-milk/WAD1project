const User = require('./../models/users-model');
const bcrypt = require('bcrypt');

// Controller function to handle User data
exports.renderLogin = (req, res) => {
    const message = req.query.message;
    res.render("login", {e: Number(message) || null})
}

exports.loginCheck = async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    if (!user || !password) {return res.render("login", {e: "All fields are required!"})}
    if (user && password) {
        try {
            const userLogin = await User.findUser(user)
            if (!userLogin) {
                return res.render("login", {e: "User not found!"})
            }

            const matchLogin = await bcrypt.compare(password, userLogin.password)
            if (!matchLogin) {
                return res.render("login", {e: "Password does not match!"})
            }

            req.session.user = {
                _id: userLogin._id,
                email: userLogin.email,
                watchlist: userLogin.watchlist,
                reviews: userLogin.reviews,
                role: userLogin.role
            }
            
            return res.redirect("/home");
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
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (!user || !password || !cpassword) {return res.render("register", {e: "All fields are required!"})}
    if (user && password && cpassword) {
        if (password != cpassword) {return res.render("register", {e: "Passwords do not match!"})}

        try {
            let newUser = {
                email: user,
                password: await bcrypt.hash(password, 10),
            };
            await User.addUser(newUser);
            res.redirect("/login?message=1")
        } catch (e) {
            console.error(e)
            res.send("Error reading database")
        }
    }
}

exports.renderSettings = async (req, res) => {
    res.render("settings", {e: null, user: req.session.user})
}


exports.updatePass = async (req, res) => {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (!password || !cpassword) {return res.render("settings", {e: "All fields are required!", user: req.session.user})}
    if (password && cpassword) {
        if (password != cpassword) {return res.render("settings", {e: "Passwords do not match!", user: req.session.user})}

        try {
            await User.updateUserPass(req.session.user._id, await bcrypt.hash(password, 10))
            return res.render("settings", {e: 1, user: req.session.user})
        } catch (e) {
            console.error(e)
            res.send("Error reading database")
        }
    }
}

exports.renderDelete = async (req, res) => {
    res.render("delete", {user: req.session.user})
}

exports.deleteAccount = async (req, res) => {
    try {
        const success = await User.deleteUser(req.session.user._id)
        if (success) {
            req.session.destroy(() => {
                res.redirect("/login?message=3")
            })
        }
    } catch (e) {
        console.error(e)
        res.send("Error reading database")
    }
}

exports.logout = async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
}