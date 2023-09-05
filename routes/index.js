const router = require("express").Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, (req, res) => {
  res.json("Home").status(200);
});

router.get("/profile", ensureAuth, async (req, res) => {
  res.render("index", { userinfo: req.user });
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});

module.exports = router;
