const router = require("express").Router();
const { ensureAuth, ensureGuest, ensureAdmin } = require("../middleware/auth");
const userModel = require("../models/User");

// Read a user by ID
router.get("/:userId", ensureAuth, (req, res) => {
  const id = req.params.userId;
  userModel
    .findById(id)
    .select("-__v -googleId -createdAt")
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user).status(200);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a user by ID
router.put("/:userId", ensureAuth, (req, res) => {
  const id = req.params.userId;
  userModel
    .findByIdAndUpdate(id, req.body, { new: true })
    .select("-__v -googleId -createdAt")
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a user by ID
router.delete("/:userId", ensureAdmin, (req, res) => {
  const id = req.params.userId;
  userModel
    .findByIdAndRemove(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send(); // No content in response
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
