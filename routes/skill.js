const router = require("express").Router();
const { ensureGuest } = require("../middleware/auth");
const UserSkill = require("../models/UserSkill");
const Skill = require("../models/Skill");

router.post("/", ensureGuest, async (req, res) => {
  const { skillId, userId } = req.body;

  try {
    const skillsToCreate = [];

    const userSkillsToCreate = [];

    for (const skillData of skillId) {
      const existingSkill = await Skill.findOne({ name: skillData.name });
      let newSkill;

      if (!existingSkill) {
        newSkill = new Skill({
          name: skillData.name,
        });
        skillsToCreate.push(newSkill);
      }

      const userSkillData = {
        userId,
        skillId: existingSkill ? existingSkill._id : newSkill._id,
        yearsOfExperience: skillData.yoe,
        rating: skillData.rating,
      };
      userSkillsToCreate.push(userSkillData);
    }

    const createdSkills = await Promise.all(
      skillsToCreate.map((skill) => skill.save())
    );

    const createdUserSkills = await UserSkill.insertMany(userSkillsToCreate);

    res.status(201).json(createdUserSkills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
