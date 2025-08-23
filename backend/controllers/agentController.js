const { validationResult } = require("express-validator");
const Agent = require("../models/Agent");

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true }).select("-password");
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private
exports.createAgent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res
        .status(400)
        .json({ message: "Agent with this email already exists" });
    }

    const agent = new Agent({
      name,
      email,
      mobile,
      password,
    });

    await agent.save();

    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobile = mobile || agent.mobile;

    await agent.save();

    res.json({
      success: true,
      message: "Agent updated successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.isActive = false;
    await agent.save();

    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
