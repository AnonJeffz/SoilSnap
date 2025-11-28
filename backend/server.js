import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connection.js";
import user from "./routes/users-routes.js";
import auth from "./routes/auth-routes.js";
import soilRoutes from "./routes/soil-routes.js";
import crop from "./routes/crop-routes.js";
import request from "./routes/request-routes.js";
import location from "./routes/location-routes.js";
import logs from "./routes/logs-routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import passport from "passport";
import "./services/passport.js"; // Passport config
import session from "express-session";
import path from "path";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://soilsnap-production.up.railway.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(generalLimiter);

const __dirname = path.resolve();

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", user);
app.use("/api/auth", auth);
app.use("/api/soil", soilRoutes);
app.use("/api/crop", crop);
app.use("/api/request", request);
app.use("/api/location", location);
app.use("/api/logs", logs);

// Static file uploads
app.use("/uploads/soil", express.static("backend/uploads/soil"));
app.use("/uploads/crops", express.static("backend/uploads/crops"));
app.use("/uploads/request", express.static("backend/uploads/request"));
app.use("/uploads/profile", express.static("backend/uploads/profile"));
app.use("/uploads/location", express.static("backend/uploads/location"));

// Serve static React files
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Explicitly serve SW and manifest
app.get("/sw.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "sw.js"));
});
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "manifest.json"));
});

// --- Important: Allow verification links to go directly ---
app.get("/api/users/verify/:token", (req, res, next) => {
  next(); // Hand over to your user verification route
});

// SPA fallback for everything else
app.get("*", (req, res) => {
  // Only serve index.html for non-API requests
  if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
