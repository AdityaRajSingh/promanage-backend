const router = require("express").Router();
const { ensureAuth, ensureGuest, ensureAdmin } = require("../middleware/auth");
const userModel = require("../models/User");
const userSkillModel = require("../models/UserSkill");
const Skill = require("../models/Skill");

// Read a user by ID

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

    // Construct the response JSON
    const userDetails = {
      user,
      skills: renamedUserSkills,
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
  const id = req.params.userId;
  const { skills, ...userData } = req.body;

  try {
    // Update user details
    const updatedUser = await userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .select("-__v -googleId -createdAt")
      .exec();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user skills

    // Create an array to store the Skill objects to be created
    const skillsToCreate = [];

    // Create an array to store the UserSkill objects to be created
    const userSkillsToCreate = [];

    // Iterate over skills array
    for (const skillData of skills) {
      // Check if the skill already exists
      const existingSkill = await Skill.findOne({ name: skillData.name });
      let newSkill;

      if (!existingSkill) {
        // Skill doesn't exist, create a new one and push it to the array
        newSkill = new Skill({
          name: skillData.name,
        });
        skillsToCreate.push(newSkill);
      }

      // Create a UserSkill object
      const userSkillData = {
        userId: id,
        skillId: existingSkill ? existingSkill._id : newSkill._id,
        yearsOfExperience: skillData.yoe,
        rating: skillData.rating,
      };
      userSkillsToCreate.push(userSkillData);
    }

    // Save all new skills in parallel
    const createdSkills = await Promise.all(
      skillsToCreate.map((skill) => skill.save())
    );

    // // Create or update user skill records
    // const updatedUserSkills = await UserSkill.bulkWrite(
    //   userSkillsToCreate.map((userSkill) => ({
    //     updateOne: {
    //       filter: { userId, id: userSkill.skillId },
    //       update: { $set: userSkill },
    //       upsert: true,
    //     },
    //   }))
    // );

    // Create user skill records
    const createdUserSkills = await userSkillModel.insertMany(
      userSkillsToCreate
    );

    res.status(201).json({ updatedUser, skills: createdSkills });

    // res.status(200).json({ user: updatedUser, skills: updatedUserSkills });
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

module.exports = router;
