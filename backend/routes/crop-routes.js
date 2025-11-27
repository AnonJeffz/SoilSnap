import express from "express";
import multer from "multer";
import path from "path";
import { createCrop, getCrop, editCrop, deleteCrop, getRecommendation, viewCrop, countCrops } from "../controllers/crop-controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/crops");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get("/count", countCrops);
router.post('/create', verifyToken, upload.single("image"), createCrop)
router.get("/", getCrop);
router.post("/recommendation", getRecommendation);
router.delete("/:id", verifyToken, deleteCrop);
router.patch("/:id", verifyToken, upload.single("image"), editCrop);
router.get("/:id", viewCrop);

export default router;