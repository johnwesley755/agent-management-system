const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const Agent = require("../models/Agent");
const List = require("../models/List");

// Helper function to parse CSV files
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => items.push(row))
      .on("end", () => resolve(items))
      .on("error", (error) => reject(error));
  });
};

// Helper function to parse Excel files
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

// Helper function to distribute items among agents
const distributeItems = (items, agents) => {
  const distribution = agents.map((agent) => ({
    agentId: agent._id,
    items: [],
  }));
  items.forEach((item, index) => {
    distribution[index % agents.length].items.push(item);
  });
  return distribution;
};

// This is the 'upload' middleware, configured and exported directly
exports.upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, XLS, and XLSX files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("csvFile");

// @desc    Process and distribute uploaded file
// @route   POST /api/lists/upload
// @access  Private
exports.processAndDistributeCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  try {
    const fileName = req.file.originalname;
    let parsedItems = [];

    if (fileName.endsWith(".csv")) {
      parsedItems = await parseCSV(filePath);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      parsedItems = parseExcel(filePath);
    }

    // --- NEW: DATA MAPPING LOGIC ---
    // This makes the upload more flexible by checking for common header variations.
    const items = parsedItems.map((item) => {
      const mappedItem = {};
      // Find the key for firstName (case-insensitive, ignores spaces)
      const firstNameKey = Object.keys(item).find(
        (k) => k.toLowerCase().replace(/\s/g, "") === "firstname"
      );
      // Find the key for phone (case-insensitive, ignores spaces, checks for 'phone number')
      const phoneKey = Object.keys(item).find(
        (k) =>
          k.toLowerCase().replace(/\s/g, "") === "phone" ||
          k.toLowerCase().replace(/\s/g, "") === "phonenumber"
      );
      // Find the key for notes (case-insensitive, ignores spaces)
      const notesKey = Object.keys(item).find(
        (k) => k.toLowerCase().replace(/\s/g, "") === "notes"
      );

      if (firstNameKey) mappedItem.firstName = item[firstNameKey];
      if (phoneKey) mappedItem.phone = item[phoneKey];
      if (notesKey) mappedItem.notes = item[notesKey];

      return mappedItem;
    });

    if (items.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data found in the file" });
    }

    const agents = await Agent.find({ createdBy: req.user.id, isActive: true });
    if (agents.length === 0) {
      return res
        .status(400)
        .json({
          message:
            "No active agents found for your account. Please add an agent first.",
        });
    }

    const distribution = distributeItems(items, agents);

    for (const dist of distribution) {
      const list = new List({
        agentId: dist.agentId,
        items: dist.items,
        fileName,
      });
      await list.save();
    }

    res.json({
      success: true,
      message: "File uploaded and distributed successfully",
      totalItems: items.length,
      agentsCount: agents.length,
    });
  } catch (error) {
    console.error(error);
    // NEW: Improved error handling for validation issues
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          message:
            "Validation failed. Ensure your file contains valid data for 'firstName' and 'phone' columns.",
        });
    }
    res.status(500).json({ message: "Error processing file" });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// @desc    Get distributed lists for the admin's own agents
// @route   GET /api/lists
// @access  Private
exports.getDistributedLists = async (req, res) => {
  try {
    const userAgents = await Agent.find({ createdBy: req.user.id }).select(
      "_id"
    );
    const agentIds = userAgents.map((agent) => agent._id);
    const lists = await List.find({ agentId: { $in: agentIds } })
      .populate("agentId", "name email")
      .sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get lists for a specific agent, ensuring it's owned by the admin
// @route   GET /api/lists/agent/:agentId
// @access  Private
exports.getAgentLists = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.agentId,
      createdBy: req.user.id,
    });
    if (!agent) {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this agent." });
    }
    const lists = await List.find({ agentId: req.params.agentId })
      .populate("agentId", "name email")
      .sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
