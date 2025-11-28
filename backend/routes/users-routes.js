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

router.post("/", createUser); 
router.get("/verify/:token", verifyUser); 

router.get("/me", verifyToken, getUser);
router.get("/all", verifyToken, requireAdmin, getAllUsers);
router.patch("/:id", upload.single("profile"), updateUser);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);
router.get("/count", getUserCount);
router.get("/soil-expert-count", getSoilExpertCount);

export default router;