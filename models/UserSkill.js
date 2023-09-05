const mongoose = require("mongoose");

const UserSkillsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming UserId refers to the User model's ObjectId
    refer: "User", // This is the name of the model to which the ObjectId refers
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming SkillId refers to the Skill model's ObjectId
    refer: "Skill", // This is the name of the model to which the ObjectId refers
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserSkills", UserSkillsSchema);
