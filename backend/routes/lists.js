const express = require("express");
const {
  upload,
  processAndDistributeCSV,
  getDistributedLists,
  getAgentLists,
} = require("../controllers/listController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes in this file are protected and require authentication
router.use(auth);

// Route to upload and distribute a file
// It first uses the 'upload' middleware, then the 'processAndDistributeCSV' controller
router.post("/upload", upload, processAndDistributeCSV);

// Route to get all distributed lists for the logged-in user's agents
router.get("/", getDistributedLists);

// Route to get lists for a specific agent
router.get("/agent/:agentId", getAgentLists);

module.exports = router;
