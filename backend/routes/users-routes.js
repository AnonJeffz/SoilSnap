import express from "express";
import multer from "multer";
import path from "path";
import { getUser, getAllUsers, createUser, deleteUser, updateUser, verifyUser, getUserCount, getSoilExpertCount } from "../controllers/user-controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = express.Router();

// CRITICAL: Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`[USER ROUTE] ${req.method} ${req.path}`);
  next();
});

// IMPORTANT: Most specific routes FIRST, before any dynamic routes
router.get("/count", getUserCount);
router.get("/soil-expert-count", getSoilExpertCount);
router.get("/all", verifyToken, requireAdmin, getAllUsers);
router.get("/me", verifyToken, getUser);

// EMAIL VERIFICATION - Must be before /:id route
router.get("/verify/:token", (req, res, next) => {
  console.log("🔍 VERIFY ROUTE HIT!");
  console.log("Token:", req.params.token);
  next();
}, verifyUser);

// POST routes
router.post("/", createUser);

// Dynamic routes LAST
router.patch("/:id", upload.single("profile"), updateUser);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);

export default router;
