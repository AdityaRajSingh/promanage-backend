const router = require("express").Router();
const { ensureGuest, ensureAdmin } = require("../middleware/auth");
const Project = require("../models/Project"); // Import the Project model
const User = require("../models/User"); // Import the User model
const UserSkill = require("../models/UserSkill"); // Import the UserSkill model
const ProjectUser = require("../models/ProjectUser"); // Import the ProjectUser model

router.get("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Step 1: Verify the project from the Project Model
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Step 2: Fetch a list of users and their skills from User and UserSkill models
    const usersWithSkills = await User.aggregate([
      {
        $lookup: {
          from: "userskills", // This should be the name of your UserSkill collection
          localField: "_id",
          foreignField: "userId",
          as: "skills",
        },
      },
    ]);

    // Step 3: Fetch the list of 'In Progress' state projects for the users
    const usersWithOngoingProjects = await Promise.all(
      usersWithSkills.map(async (user) => {
        const ongoingProjects = await ProjectUser.find({
          userId: user._id,
          status: "In Progress",
        });

        user.noOfOngoingProjects = ongoingProjects.length;
        return user;
      })
    );

    // Step 4: Send the response
    res.status(200).json(usersWithOngoingProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
