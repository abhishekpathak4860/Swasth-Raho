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

const allowedOrigins = [
  "http://localhost:3000",
  "https://swasth-raho.vercel.app", // your backend (self-origin)
  "https://your-frontend-name.vercel.app", // when you deploy frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// handle preflight requests automatically
// app.options("*", cors());

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
