const mongoose = require("mongoose");

const UserSkillsSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming UserId refers to the User model's ObjectId
    refer: "User", // This is the name of the model to which the ObjectId refers
    required: true,
  },
  SkillId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming SkillId refers to the Skill model's ObjectId
    refer: "Skill", // This is the name of the model to which the ObjectId refers
    required: true,
  },
  YearsOfExperience: {
    type: Number,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserSkills", UserSkillsSchema);
