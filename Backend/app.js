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
// // Allowed origins
// const allowedOrigins = {
//   origin: ["https://swasth-raho-9ehr.vercel.app"],
// };

// app.use(cors(allowedOrigins));

// Allowed frontend origin
const allowedOrigins = ["https://swasth-raho-9ehr.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like server-to-server or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Handle preflight requests explicitly
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// Handle preflight requests
// app.options("*", cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("home page"));
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

export default app;
