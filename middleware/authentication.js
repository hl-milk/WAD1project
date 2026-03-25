exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }

    return res.redirect("/login?message=2");
};

exports.isAdminUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }

    return res.send("Access denied. Admin only.");
};
