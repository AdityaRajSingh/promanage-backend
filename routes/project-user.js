const router = require("express").Router();
const { ensureGuest } = require("../middleware/auth");
const projectUserModal = require("../models/ProjectUser");

router.post("/", ensureGuest, async (req, res) => {
  let projectId = req.body.projectId;
  let newUserIds = req.body.userIds;

  try {
    await projectUserModal.deleteMany({ projectId });

    if (newUserIds.length > 0) {
      const projectUsers = await projectUserModal.create(
        newUserIds.map((userId) => ({ projectId, userId }))
      );
      res.status(201).json(projectUsers);
    } else {
      res.status(400).json({ error: "No valid user IDs provided." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:projectId", ensureGuest, async (req, res) => {
  const projectId = req.params.projectId;
  console.log("Project ID", projectId);
  try {
    const projectUsers = await projectUserModal
      .find({ projectId })
      .populate("userId", "-__v -createdAt -password")
      .select("-__v -createdAt");
    res.status(200).json(projectUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
