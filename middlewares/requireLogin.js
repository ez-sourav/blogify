function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect("/user/signin?error=login_required");
  }
  next();
}

module.exports = { requireLogin };
