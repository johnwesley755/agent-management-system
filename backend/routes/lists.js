const express = require("express");
const {
  uploadCSV,
  getDistributedLists,
  getAgentLists,
} = require("../controllers/listController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(auth);

// Upload and distribute CSV
router.post("/upload", uploadCSV);

// Get all distributed lists
router.get("/", getDistributedLists);

// Get lists for specific agent
router.get("/agent/:agentId", getAgentLists);

module.exports = router;
