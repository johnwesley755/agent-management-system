const { validationResult } = require("express-validator");
const Agent = require("../models/Agent");
const List = require("../models/List"); // Make sure List model is imported if you cascade deletes

// @desc    Get all agents for the logged-in admin
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res) => {
  try {
    // SECURE: Filter agents by the logged-in user's ID
    const agents = await Agent.find({
      createdBy: req.user.id,
      isActive: true,
    }).select("-password");
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new agent for the logged-in admin
// @route   POST /api/agents
// @access  Private
exports.createAgent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobile, password } = req.body;

    // --- THIS IS THE FIX ---
    // Check if an ACTIVE agent already exists with this email
    const existingAgent = await Agent.findOne({ email, isActive: true });
    if (existingAgent) {
      return res
        .status(400)
        .json({ message: "An active agent with this email already exists" });
    }

    const agent = new Agent({
      name,
      email,
      mobile,
      password,
      createdBy: req.user.id, // SECURE: Assign ownership to the logged-in user
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

// @desc    Update an agent owned by the logged-in admin
// @route   PUT /api/agents/:id
// @access  Private
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // SECURE: Check if the logged-in user owns this agent
    if (agent.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You are not authorized to update this agent.",
        });
    }

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobile = mobile || agent.mobile;

    await agent.save();

    res.json({
      success: true,
      message: "Agent updated successfully",
      agent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an agent owned by the logged-in admin
// @route   DELETE /api/agents/:id
// @access  Private
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // SECURE: Check if the logged-in user owns this agent
    if (agent.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You are not authorized to delete this agent.",
        });
    }

    // Option 1: Soft delete (current implementation)
    agent.isActive = false;
    await agent.save();

    // Option 2: Hard delete (uncomment below to permanently delete)
    // await List.deleteMany({ agentId: agent._id }); // Also delete their lists
    // await Agent.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
