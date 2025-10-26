import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/DB.js";
import registerRoute from "./routes/registerRoute.js";
import patientDashboardDataRoute from "./routes/patientDashboardData.js";
import doctorDashboardDataRoute from "./routes/doctorDashboardData.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allowed Origins
app.use(
  cors({
    origin: ["https://swasth-raho-9ehr.vercel.app", "http://localhost:3000"], // your frontend URL
    credentials: true,
  })
);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Running", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", registerRoute);
app.use("/patient", patientDashboardDataRoute);
app.use("/doctor", doctorDashboardDataRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

await connectDB();
export default app;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
