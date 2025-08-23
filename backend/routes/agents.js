const express = require("express");
const { body } = require("express-validator");
const {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../controllers/agentController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(auth);

// Get all agents
router.get("/", getAgents);

// Create agent
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }),
    body("email").isEmail().normalizeEmail(),
    body("mobile.countryCode").notEmpty(),
    body("mobile.number").isMobilePhone(),
    body("password").isLength({ min: 6 }),
  ],
  createAgent
);

// Update agent
router.put("/:id", updateAgent);

// Delete agent
router.delete("/:id", deleteAgent);

module.exports = router;
