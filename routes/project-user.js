const router = require("express").Router();
const { ensureGuest, ensureAdmin } = require("../middleware/auth");
const projectUserModal = require("../models/ProjectUser");

// Create a api route that would accept a project id and array of user ids and create a project user record for each user id, similarly update th project users based on the userId array and delete userId array from the project users

router.post("/", ensureGuest, async (req, res) => {
  const projectId = req.body.projectId;
  const userIds = req.body.userIds;
  try {
    const projectUsers = await createProjectUsers(projectId, userIds);
    res.status(201).json(projectUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
