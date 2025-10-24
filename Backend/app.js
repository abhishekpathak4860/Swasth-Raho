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

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

// Handle preflight requests
app.options("*", cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("home page"));
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    await connectDB(); // connect or reuse cached DB connection
    app(req, res); // forward request to Express app
  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
