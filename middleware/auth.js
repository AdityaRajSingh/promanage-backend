module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
  ensureAdmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.email === "aditya@truesparrow.com") {
        return next();
      } else {
        res.redirect("/profile");
      }
    } else {
      res.redirect("/login");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
  },
};
