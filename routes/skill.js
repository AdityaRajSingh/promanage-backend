const router = require("express").Router();
const { ensureGuest } = require("../middleware/auth");
const UserSkill = require("../models/UserSkill");
const Skill = require("../models/Skill");

// Create a user skill record
router.post("/", ensureGuest, async (req, res) => {
  const { skillId, userId } = req.body;

  try {
    // Create an array to store the Skill objects to be created
    const skillsToCreate = [];

    // Create an array to store the UserSkill objects to be created
    const userSkillsToCreate = [];

    // Iterate over skillId array
    for (const skillData of skillId) {
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
        userId,
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

    // Create user skill records
    const createdUserSkills = await UserSkill.insertMany(userSkillsToCreate);

    res.status(201).json(createdUserSkills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
