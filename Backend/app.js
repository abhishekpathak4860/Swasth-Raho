import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import cookieParser from "cookie-parser";
import patientDashboardDataRoute from "./routes/patientDashboardData.js";
import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";

dotenv.config();
const app = express();
connectDB();

// FIXED: Comprehensive CORS configuration
const allowedOrigins = [
  "https://swasth-raho-9ehr.vercel.app",
  "http://localhost:3000", // for local development
];

// CORS configuration with proper error handling
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Explicit preflight handling
app.options("*", (req, res) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma"
    );
    res.status(204).send();
  } else {
    res.status(403).send("CORS not allowed");
  }
});

// Additional middleware for all requests
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Swasth-Raho Backend API",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
      origin: req.headers.origin,
    });
  }

  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
