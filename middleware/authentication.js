exports.isLoggedIn = (req, res, next) => {
    if (!req.session. user) {
        return res.redirect("/login?message=2")
    }
    next();
}