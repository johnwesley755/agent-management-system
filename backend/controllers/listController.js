const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const Agent = require("../models/Agent");
const List = require("../models/List");

// Configure multer for file uploads
const storage = multer.diskStorage({
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
});

const fileFilter = (req, file, cb) => {
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
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("csvFile");

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Validate required fields
        if (data.FirstName && data.Phone) {
          results.push({
            firstName: data.FirstName.trim(),
            phone: data.Phone.toString().trim(),
            notes: data.Notes ? data.Notes.trim() : "",
          });
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    return data
      .map((row) => ({
        firstName: row.FirstName ? row.FirstName.toString().trim() : "",
        phone: row.Phone ? row.Phone.toString().trim() : "",
        notes: row.Notes ? row.Notes.toString().trim() : "",
      }))
      .filter((item) => item.firstName && item.phone);
  } catch (error) {
    throw new Error("Error parsing Excel file");
  }
};

// Distribute items among agents
const distributeItems = (items, agents) => {
  const itemsPerAgent = Math.floor(items.length / agents.length);
  const remainder = items.length % agents.length;

  const distribution = [];
  let currentIndex = 0;

  agents.forEach((agent, index) => {
    const itemCount = itemsPerAgent + (index < remainder ? 1 : 0);
    const agentItems = items.slice(currentIndex, currentIndex + itemCount);

    distribution.push({
      agentId: agent._id,
      items: agentItems,
    });

    currentIndex += itemCount;
  });

  return distribution;
};

// @desc    Upload and distribute CSV
// @route   POST /api/lists/upload
// @access  Private
exports.uploadCSV = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const filePath = req.file.path;
      const fileName = req.file.originalname;
      let items = [];

      // Parse file based on extension
      if (fileName.endsWith(".csv")) {
        items = await parseCSV(filePath);
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        items = parseExcel(filePath);
      }

      if (items.length === 0) {
        fs.unlinkSync(filePath); // Clean up uploaded file
        return res
          .status(400)
          .json({ message: "No valid data found in the file" });
      }

      // Get active agents
      const agents = await Agent.find({ isActive: true }).limit(5);
      if (agents.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: "No active agents found" });
      }

      // Distribute items among agents
      const distribution = distributeItems(items, agents);

      // Save distributed lists to database
      const savedLists = [];
      for (const dist of distribution) {
        const list = new List({
          agentId: dist.agentId,
          items: dist.items,
          fileName,
        });

        await list.save();
        savedLists.push(list);
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: "File uploaded and distributed successfully",
        totalItems: items.length,
        agentsCount: agents.length,
        distribution: savedLists.map((list) => ({
          agentId: list.agentId,
          itemCount: list.items.length,
        })),
      });
    } catch (error) {
      console.error(error);
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: "Error processing file" });
    }
  });
};

// @desc    Get distributed lists
// @route   GET /api/lists
// @access  Private
exports.getDistributedLists = async (req, res) => {
  try {
    const lists = await List.find()
      .populate("agentId", "name email")
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get lists for specific agent
// @route   GET /api/lists/agent/:agentId
// @access  Private
exports.getAgentLists = async (req, res) => {
  try {
    const lists = await List.find({ agentId: req.params.agentId })
      .populate("agentId", "name email")
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
