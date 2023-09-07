const router = require("express").Router();
const { ensureAuth, ensureGuest, ensureAdmin } = require("../middleware/auth");
const userModel = require("../models/User");
const userSkillModel = require("../models/UserSkill");
const Skill = require("../models/Skill");
const projectModal = require("../models/Project");
const ProjectUser = require("../models/ProjectUser");
const { default: jwtDecode } = require("jwt-decode");

router.get("/:userId", ensureGuest, async (req, res) => {
  try {
    const userId = req.params.userId;

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
      .populate("skillId", "-__v -createdAt ")
      .select("-__v -createdAt -userId -_id");

    // Rename the "skillId" field to "skills" in each userSkill object
    const renamedUserSkills = userSkills.map((skill) => ({
      yearsOfExperience: skill.yearsOfExperience,
      rating: skill.rating,
      skill: skill.skillId,
    }));

    // Find the projects the user is involved in

    const projectUsers = await ProjectUser.find({ userId })
      .populate("projectId", "-__v -createdAt")
      .select("-__v -createdAt -userId -_id");

    console.log(projectUsers);

    // Rename the "projectId" field to "project" in each projectUser object

    const projectDetails = projectUsers.map((project) => ({
      project: project.projectId,
    }));

    // Construct the response JSON
    const userDetails = {
      user,
      skills: renamedUserSkills,
      projects: projectDetails,
    };

    // Send the response as JSON
    res.json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user by ID and skills
router.put("/:userId", ensureGuest, async (req, res) => {
  const userId = req.params.userId;
  const { skills, ...userData } = req.body;

  try {
    // Update user details
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, userData, { new: true })
      .select("-__v -googleId -createdAt")
      .exec();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the existing user skills
    const existingUserSkills = await userSkillModel.find({ userId });

    // Create a list of skill names from the existing user skills
    const existingUserSkillNames = existingUserSkills.map(
      (skill) => skill.skillId.name
    );

    // Iterate through the input skills
    for (const skill of skills) {
      const { name, yoe, rating } = skill;

      // Check if the skill already exists
      const existingSkill = await Skill.findOne({ name });

      if (existingSkill) {
        // Skill exists, update user skill if necessary
        if (!existingUserSkillNames.includes(name)) {
          // Create a new UserSkills entry if the user doesn't have this skill
          await userSkillModel.create({
            userId,
            skillId: existingSkill._id,
            yearsOfExperience: yoe,
            rating: rating,
          });
        } else {
          // Update the existing UserSkills entry
          await userSkillModel.findOneAndUpdate(
            { userId, skillId: existingSkill._id },
            { yearsOfExperience: yoe, rating: rating }
          );
        }
      } else {
        // Skill doesn't exist, create a new skill and user skill entry
        const newSkill = await Skill.create({ name });
        await userSkillModel.create({
          userId,
          skillId: newSkill._id,
          yearsOfExperience: yoe,
          rating: rating,
        });
      }
    }

    // Remove user skills not included in the input
    for (const userSkill of existingUserSkills) {
      if (!skills.some((skill) => skill.name === userSkill.skillId.name)) {
        await userSkillModel.findByIdAndRemove(userSkill._id);
      }
    }

    return res.status(200).json({ message: "Skills updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
