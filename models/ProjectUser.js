const mongoose = require("mongoose");

const ProjectUsersSchema = new mongoose.Schema({
  ProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // Reference to the Project model
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  Status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProjectUsers", ProjectUsersSchema);
