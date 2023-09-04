const router = require("express").Router();
const { ensureAuth, ensureGuest, ensureAdmin } = require("../middleware/auth");
const userModel = require("../models/User");

// Get Users
router.get("/", ensureAuth, (req, res) => {
  userModel
    .find()
    .select("-__v -googleId -createdAt")
    .exec()
    .then((users) => {
      res.json(users).status(200);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
