const router = require("express").Router();
const { ensureGuest, ensureAdmin } = require("../middleware/auth");
const Project = require("../models/Project"); // Import the Project model
const User = require("../models/User"); // Import the User model
const UserSkill = require("../models/UserSkill"); // Import the UserSkill model
const ProjectUser = require("../models/ProjectUser"); // Import the ProjectUser model
const Suggest = require("../lib/openAi/suggest"); // Import the Suggest class

router.get("/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Step 1: Verify the project from the Project Model
    const project = await Project.findById(projectId).select(
      "-__v -_id -clientName -status -startDate -endDate -createdAt"
    );

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

    await User.populate(usersWithSkills, {
      path: "skills.skillId",
      model: "Skill",
    });

    const formattedResponse = usersWithSkills.map((user) => {
      const formattedUser = {
        _id: user._id,
        displayName: user.displayName,
      };

      if (user.designation) {
        formattedUser.designation = user.designation;
        formattedUser.yearsOfExperience = user.yearsOfExperience;
      }

      formattedUser.skills = user.skills.map((skill) => ({
        name: skill.skillId.name,
        yearsOfExperience: skill.yearsOfExperience,
        rating: skill.rating,
      }));

      formattedUser.noOfOngoingProjects = 0; // Initialize with 0

      return formattedUser;
    });

    // Step 3: Fetch the list of 'In Progress' state projects for the users
    const usersWithOngoingProjects = await Promise.all(
      formattedResponse.map(async (user) => {
        const ongoingProjects = await ProjectUser.find({
          userId: user._id,
          status: "In Progress",
        });

        user.noOfOngoingProjects = ongoingProjects.length;
        return user;
      })
    );

    // Step 4: Fetch team composition from OpenAI

    const suggestTeam = new Suggest({
      projectDetails: project,
      resoucesList: usersWithOngoingProjects,
    });

    const suggestedTeamResponse = await suggestTeam.getSuggestions();

    const parsedResponse = JSON.parse(suggestedTeamResponse);

    console.log(" Parsed ", parsedResponse);

    // Step 5: Send the response
    res.status(200).json(parsedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
