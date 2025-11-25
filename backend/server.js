import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connection.js";
import user from "./routes/users-routes.js";
import auth from "./routes/auth-routes.js";
import soilRoutes from "./routes/soil-routes.js";
import crop from "./routes/crop-routes.js"
import request from "./routes/request-routes.js"
import location from "./routes/location-routes.js"
import logs from "./routes/logs-routes.js"
import { generalLimiter } from "./middleware/rateLimiter.js";
import passport from "passport";
import "./services/passport.js"; // Import the passport configuration
import session from "express-session";
import transporter from "./config/mail.js";
import path from "path";

dotenv.config();

const app = express();
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://soilsnap-production.up.railway.app",
  ],
  credentials: true, // Enable cookies/credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(cookieParser()); 
app.use(express.json()); 
app.use(generalLimiter);

const __dirname = path.resolve();

app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", auth);

app.use("/api/users", user);
app.use("/api/auth", auth);
app.use("/api/soil", soilRoutes);
app.use("/api/crop", crop);
app.use("/api/request", request);
app.use("/api/location", location);
app.use("/api/logs", logs);

app.use("/uploads/soil", express.static("backend/uploads/soil"));
app.use("/uploads/crops", express.static("backend/uploads/crops"));
app.use("/uploads/request", express.static("backend/uploads/request"));
app.use("/uploads/profile", express.static("backend/uploads/profile"));
app.use("/uploads/location", express.static("backend/uploads/location"));

// if(process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/sw.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "sw.js"));
});
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "manifest.json"));
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


if (typeof transporter?.verify === 'function') {
  // nodemailer transporter
  transporter.verify()
    .then(() => console.log('Mail transporter verified: SMTP connection OK'))
    .catch(err => console.error('Mail transporter verification failed:', err && err.message ? err.message : err));
} else if (typeof transporter?.sendMail === 'function') {
  // SendGrid wrapper (or similar) — perform a one-off test send (temporary)
  const testAddr = process.env.SENDGRID_FROM || process.env.EMAIL_USER;
  transporter.sendMail({
    from: process.env.SENDGRID_FROM || process.env.EMAIL_USER,
    to: testAddr,
    subject: 'SoilSnap: mailer test',
    text: 'If you receive this, the mailer is configured correctly.',
  })
    .then(() => console.log('Mail wrapper test send succeeded'))
    .catch(err => console.error('Mail wrapper test failed:', err && err.message ? err.message : err));
}

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});

