const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
  deleteProfile,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  login
);

router.post(
  "/forgot-password",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  ],
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  ],
  resetPassword
);


// --- PROTECTED ROUTES ---
// Apply auth middleware to all subsequent routes in this file
router.use(auth);

router.post("/logout", logout);

router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
  ],
  changePassword
);

router.get("/me", getMe);

router.put(
  "/profile",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  ],
  updateProfile
);
router.delete("/profile", deleteProfile);
module.exports = router;