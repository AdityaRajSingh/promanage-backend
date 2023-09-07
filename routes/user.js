const router = require("express").Router();
const { ensureAuth, ensureGuest, ensureAdmin } = require("../middleware/auth");
const userModel = require("../models/User");
const userSkillModel = require("../models/UserSkill");
const projectModal = require("../models/Project");
const ProjectUser = require("../models/ProjectUser");
const { default: jwtDecode } = require("jwt-decode");

router.get("/:userId", ensureGuest, async (req, res) => {
  try {
    const userId = req.params.userId;

    const id = req.params.userId;

    let projectUsers = await ProjectUser.find({ userId: id });

    let projectIds = projectUsers.map((projectUser) => projectUser.projectId);

    let projects = await projectModal.find({ _id: { $in: projectIds } });

    let projectDetails = projects.map((project) => {
      return {
        projectId: project._id,
        name: project.name,
        description: project.description,
        clientName: project.clientName,
        estimatedDeliveryTime: project.estimatedDeliveryTime,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
      };
    });

    // Find the user by userId
    const user = await userModel
      .findById(userId)
      .select("-__v -googleId -createdAt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the user's skills by userId
    const userSkills = await userSkillModel
      .find({ userId })
      .select("-__v -createdAt");

    // Construct the response JSON
    const userDetails = {
      user,
      skills: userSkills,
      projects: projectDetails,
    };

    // Send the response as JSON
    res.json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user by ID
router.put("/:userId", ensureGuest, (req, res) => {
  const id = req.params.userId;
  console.log("Updated request Body", req.body);
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
router.delete("/:userId", ensureGuest, (req, res) => {
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

// Create a user
router.post("/", ensureGuest, (req, res) => {
  const token = req.body.token;

  const decodeToken = jwtDecode(token);

  const firstName = decodeToken.name.split(" ")[0];
  const lastName = decodeToken.name.split(" ")[1];
  const displayName = decodeToken.name;
  const email = decodeToken.email;
  const googleId = decodeToken.sub;
  const image = decodeToken.picture;

  const user = new userModel({
    googleId,
    firstName,
    lastName,
    displayName,
    email,
    image,
  });

  user
    .save()
    .then(() => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
