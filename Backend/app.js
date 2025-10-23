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

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// api calls here
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
