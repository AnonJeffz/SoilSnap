import express from "express";
import multer from "multer";
import path from "path";
import { createSoil, getSoil, editSoil, deleteSoil, viewSoil, countSoil } from "../controllers/soil-controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/soil");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), verifyToken, createSoil);
router.get("/", getSoil);
router.put("/:id", upload.single("image"), verifyToken, editSoil);
router.delete("/:id", verifyToken, deleteSoil);
router.get('/count', countSoil);
router.get('/:id', viewSoil);

export default router;