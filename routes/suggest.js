const router = require("express").Router();
const { ensureGuest, ensureAdmin } = require("../middleware/auth");
const Project = require("../models/Project"); // Import the Project model
const User = require("../models/User"); // Import the User model
const UserSkill = require("../models/UserSkill"); // Import the UserSkill model
const ProjectUser = require("../models/ProjectUser"); // Import the ProjectUser model

router.get("/:projectId", ensureGuest, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Step 1: Verify the project from the Project Model
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Step 2: Fetch a list of users and their skills
    const usersWithSkills = await User.aggregate([
      {
        $lookup: {
          from: "userskills", // This should match the collection name for UserSkill
          localField: "_id",
          foreignField: "userId",
          as: "skills",
        },
      },
    ]);

    // Step 3: Fetch the list of 'In Progress' state projects for the users
    const inProgressProjects = await ProjectUser.find({
      userId: { $in: usersWithSkills.map((user) => user._id) },
      status: "In Progress",
    }).populate("projectId");

    // Step 4: Compile the information
    const suggestedData = {
      project,
      usersWithSkills,
      inProgressProjects,
    };

    // Step 5: Send the response
    res.json(suggestedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
