const router = require("express").Router();
const { ensureGuest, ensureAdmin } = require("../middleware/auth");
const projectModal = require("../models/Project");

router.get("/in-progress", ensureGuest, (req, res) => {
  projectModal
    .find({ status: "In Progress" })
    .select("-__v -createdAt")
    .exec()
    .then((projects) => {
      res.json(projects).status(200);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Read a project by ID
router.get("/:projectId", ensureGuest, (req, res) => {
  const id = req.params.projectId;
  let projectRecord = {};
  projectModal
    .findById(id)
    .select("-__v -createdAt")
    .exec()
    .then((project) => {
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      projectRecord = project;
      res.json(projectRecord).status(200);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Create a project
router.post("/", ensureGuest, (req, res) => {
  const project = new projectModal({
    name: req.body.name,
    description: req.body.description,
    clientName: req.body.clientName,
    estimatedDeliveryTime: req.body.estimatedDeliveryTime,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });
  project
    .save()
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a project by ID
router.put("/:projectId", ensureGuest, (req, res) => {
  const id = req.params.projectId;
  console.log("Updated request Body", req.body);
  projectModal
    .findByIdAndUpdate(id, req.body, { new: true })
    .select("-__v -createdAt")
    .exec()
    .then((project) => {
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(200).json(project);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a user by ID
router.delete("/:projectId", ensureGuest, (req, res) => {
  const id = req.params.projectId;
  projectModal
    .findByIdAndRemove(id)
    .exec()
    .then((project) => {
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Read all projects
router.get("/", ensureGuest, (req, res) => {
  projectModal
    .find()
    .select("-__v -createdAt")
    .exec()
    .then((projects) => {
      res.json(projects).status(200);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
